/**
 * Admin Panel — session ผ่าน signed cookie (HttpOnly/Secure/SameSite=Strict)
 * เซ็นด้วย HMAC-SHA256 (SESSION_SECRET) ใส่ expiry ไว้ในตัว payload เอง — stateless
 * ไม่ต้องเก็บ session ฝั่งเซิร์ฟเวอร์ (ไม่ต้องใช้ KV/D1 เพิ่ม)
 */

const SESSION_COOKIE_NAME = "baandek_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง — ปรับได้ตามต้องการ

async function hmacSignHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Buffer.from(sigBuffer).toString("hex");
}

export async function createSessionCookieHeader(sessionSecret: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = await hmacSignHex(sessionSecret, payload);
  const value = `${payload}.${signature}`;
  return `${SESSION_COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function isValidSession(request: Request, sessionSecret: string): Promise<boolean> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  if (!match) return false;

  const dotIndex = match[1].indexOf(".");
  if (dotIndex === -1) return false;
  const payload = match[1].slice(0, dotIndex);
  const signature = match[1].slice(dotIndex + 1);
  if (!payload || !signature) return false;

  const expectedSignature = await hmacSignHex(sessionSecret, payload);
  if (expectedSignature !== signature) return false;

  const expiresAt = Number(payload);
  if (!expiresAt || Date.now() > expiresAt) return false;

  return true;
}

/**
 * เทียบรหัสผ่านทีละตัวอักษรเสมอ (ไม่ short-circuit ออกทันทีที่เจอตัวไม่ตรง) ลดความเสี่ยง
 * เดารหัสผ่านจาก response-time เทียบสตริงแบบปกติ — ไม่ใช่ crypto-grade timing-safe
 * แต่เพียงพอสำหรับ threat model ของรหัสผ่านใช้ร่วมกันภายในคลินิกเท่านั้น
 */
export function passwordMatches(submitted: string, expected: string): boolean {
  if (submitted.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < submitted.length; i++) {
    result |= submitted.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}
