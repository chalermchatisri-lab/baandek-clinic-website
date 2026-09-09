// ลิงก์สำรอง ใช้เฉพาะช่วงที่ยังโหลด content-data ไม่เสร็จ หรือโหลดไม่สำเร็จเท่านั้น —
// ค่าจริงมาจากชีต LINKS ผ่าน content-data (runtime) เพื่อให้แก้ที่ชีตที่เดียวแล้วมีผลทันที
// ทั้ง Landing Page / LINE OA / Messenger โดยไม่ต้อง build+deploy เว็บใหม่
export const FALLBACK_LINKS: Record<string, string> = {
  VACCINE_ADVISOR: "https://baandek-line-worker.baandek-clinic.workers.dev/vaccine-advisor",
  GOOGLE_MAPS: "https://bit.ly/baandek-map",
  PHONE: "0850659715",
  FACEBOOK_PAGE: "BaanDekClinic",
  LINE_OA: "@739fjvrr",
  ADDRESS: "41, 59 ถนนกาญจนวิถี ตำบลบางกุ้ง อำเภอเมืองสุราษฎร์ธานี 84000",
};

export const CONTENT_API_URL = "https://baandek-clinic.onrender.com/public/content-data";

/** "0850659715" -> "085-065-9715" (format เดียวกับที่บอทใช้ในข้อความ) */
export function formatPhone(raw: string): string {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("66")) d = "0" + d.slice(2);
  // Sheets ตัด 0 นำหน้าทิ้งได้ถ้าเซลล์ไม่ได้เป็นข้อความล้วน — เติมคืนเองกันพลาด
  if (d.length === 9) d = "0" + d;
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : d;
}

// Apps Script exec URL บางครั้ง fetch ล้มเหลวแบบสุ่ม (network flaky ไม่เกี่ยวกับข้อมูล) —
// ลองใหม่อีกไม่กี่ครั้งก่อนยอมแพ้ กัน section ทั้งหมดหายไปเฉย ๆ จาก fetch พลาดแค่ครั้งเดียว
export async function fetchJsonWithRetry(url: string, attempts = 3): Promise<any> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      lastError = e;
      if (i < attempts - 1) await new Promise(res => setTimeout(res, 400 * (i + 1)));
    }
  }
  throw lastError;
}
