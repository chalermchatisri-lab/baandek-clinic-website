/**
 * Admin Panel — เรียก Apps Script admin-list/admin-update/admin-create ฝั่งเซิร์ฟเวอร์
 * เท่านั้น (จาก Worker ไม่ใช่ browser) เพื่อไม่ให้ ADMIN_API_TOKEN หลุดไปที่ browser เลย
 * ใช้ URL /exec เดียวกับที่ app/page.tsx เรียกฝั่ง client สำหรับ content-data/clinic-status
 * (ไม่ใช่ความลับ — เป็น URL public web app เดิมของ Apps Script อยู่แล้ว)
 */
const APPS_SCRIPT_EXEC_URL =
  "https://script.google.com/macros/s/AKfycbwLWrXzrD9hL4aOCOYbYbbSxOMQzYAohC-nrrsVrjXEvop9A12lKsYkme_eel-GJzsVWA/exec";

export async function adminList(token: string, sheet: string): Promise<unknown> {
  const url = new URL(APPS_SCRIPT_EXEC_URL);
  url.searchParams.set("mode", "admin-list");
  url.searchParams.set("sheet", sheet);
  url.searchParams.set("token", token);
  const response = await fetch(url.toString(), { method: "GET", redirect: "follow" });
  return response.json();
}

async function adminPost(token: string, mode: string, body: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(APPS_SCRIPT_EXEC_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, token, ...body }),
  });
  return response.json();
}

export async function adminUpdate(
  token: string,
  sheet: string,
  row: number,
  anchorValue: unknown,
  fields: Record<string, unknown>
): Promise<unknown> {
  return adminPost(token, "admin-update", { sheet, row, anchorValue, fields });
}

export async function adminCreate(
  token: string,
  sheet: string,
  fields: Record<string, unknown>
): Promise<unknown> {
  return adminPost(token, "admin-create", { sheet, fields });
}
