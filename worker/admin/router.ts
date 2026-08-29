/**
 * Admin Panel — router แยกขาดจาก Next.js/vinext โดยสิ้นเชิง เรียกจาก worker/index.ts
 * ก่อน delegate ไปที่ vinext (เหมือน pattern เดิมของ /_vinext/image)
 */
import { createSessionCookieHeader, clearSessionCookieHeader, isValidSession, passwordMatches } from "./auth";
import { adminList, adminUpdate, adminCreate } from "./appsScriptClient";
import { renderLoginPage, renderAdminShell } from "./templates";

interface AdminEnv {
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  ADMIN_API_TOKEN: string;
}

const ALLOWED_SHEETS = [
  "VACCINES", "TEAM", "PROMOS", "PROMOTIONS", "REVIEWS",
  "CLINIC_HOURS", "AGE_GUIDE", "VACCINE_RULES", "DISEASE_GROUP",
  "VACCINE_NEWS", "ARTICLES", "CLOSURES",
];

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
}

function htmlResponse(body: string, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", ...extraHeaders },
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function handleAdminRequest(request: Request, env: AdminEnv): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === "/admin/login" && request.method === "POST") {
    return handleLogin(request, env);
  }

  if (pathname === "/admin/logout" && request.method === "POST") {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Set-Cookie": clearSessionCookieHeader() },
    });
  }

  if (pathname === "/admin" && request.method === "GET") {
    const loggedIn = await isValidSession(request, env.SESSION_SECRET);
    if (!loggedIn) {
      return htmlResponse(renderLoginPage());
    }
    return htmlResponse(renderAdminShell());
  }

  if (pathname.startsWith("/api/admin/")) {
    const loggedIn = await isValidSession(request, env.SESSION_SECRET);
    if (!loggedIn) {
      return jsonResponse({ ok: false, error: "unauthorized" }, 401);
    }
    return handleAdminApi(request, env, pathname);
  }

  return new Response("Not Found", { status: 404 });
}

async function handleLogin(request: Request, env: AdminEnv): Promise<Response> {
  const formData = await request.formData();
  const password = String(formData.get("password") || "");

  if (!env.ADMIN_PASSWORD || !passwordMatches(password, env.ADMIN_PASSWORD)) {
    return htmlResponse(renderLoginPage("รหัสผ่านไม่ถูกต้องค่ะ"), 401);
  }

  const cookie = await createSessionCookieHeader(env.SESSION_SECRET);
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin", "Set-Cookie": cookie },
  });
}

function validateSheetParam(sheet: string | null): string | null {
  const upper = String(sheet || "").toUpperCase();
  return ALLOWED_SHEETS.includes(upper) ? upper : null;
}

/**
 * Apps Script (ผ่าน Google) บางครั้งตอบ error page ที่ parse เป็น JSON ไม่ได้ชั่วคราว
 * (เจอบ่อยตลอด session นี้ — "ไม่สามารถเปิดไฟล์ได้ในเวลานี้") ถ้าไม่ครอบ try/catch
 * ตรงนี้ exception จะหลุดขึ้นไปเป็นหน้า error ดิบของ Cloudflare (โค้ด 1101) แทนที่จะ
 * เป็นข้อความสั้นๆ ให้กดลองใหม่ — ครอบทุกจุดที่เรียก Apps Script ให้ตอบ JSON เสมอ
 */
async function callAppsScriptSafely_(fn: () => Promise<unknown>): Promise<Response> {
  try {
    const result = await fn();
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse(
      { ok: false, error: "เชื่อมต่อไม่สำเร็จชั่วคราว กรุณาลองใหม่อีกครั้งค่ะ" },
      502
    );
  }
}

async function handleAdminApi(request: Request, env: AdminEnv, pathname: string): Promise<Response> {
  if (pathname === "/api/admin/list" && request.method === "GET") {
    const url = new URL(request.url);
    const sheet = validateSheetParam(url.searchParams.get("sheet"));
    if (!sheet) {
      return jsonResponse({ ok: false, error: "ไม่รู้จักชีตนี้" }, 400);
    }
    return callAppsScriptSafely_(() => adminList(env.ADMIN_API_TOKEN, sheet));
  }

  if (pathname === "/api/admin/update" && request.method === "POST") {
    const body = (await request.json()) as {
      sheet?: string;
      row?: number;
      anchorValue?: unknown;
      fields?: Record<string, unknown>;
    };
    const sheet = validateSheetParam(body.sheet || null);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "ไม่รู้จักชีตนี้" }, 400);
    }
    return callAppsScriptSafely_(() =>
      adminUpdate(env.ADMIN_API_TOKEN, sheet, Number(body.row), body.anchorValue, body.fields || {})
    );
  }

  if (pathname === "/api/admin/create" && request.method === "POST") {
    const body = (await request.json()) as { sheet?: string; fields?: Record<string, unknown> };
    const sheet = validateSheetParam(body.sheet || null);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "ไม่รู้จักชีตนี้" }, 400);
    }
    return callAppsScriptSafely_(() => adminCreate(env.ADMIN_API_TOKEN, sheet, body.fields || {}));
  }

  return jsonResponse({ ok: false, error: "not found" }, 404);
}
