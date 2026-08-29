// การ์ดข่าวสารวัคซีน (VACCINE_NEWS) — ตั้งใจให้ดูเป็น "ข่าวประกาศ" แยกจากการ์ด
// ARTICLES ("บทความความรู้") ด้วยสีพื้นหลังโทนอำพัน/ทอง (amber) ต่างจากโทนเขียว/ครีม
// ของการ์ดความรู้ทั่วไป + badge "ข่าวสาร" มุมการ์ด
// เนื้อหา Description แสดงเต็ม ไม่มี modal/ตัดสั้น เพราะเนื้อหาสั้นพอจะอ่านในการ์ดได้เลย
// StartDate โชว์ตามที่ API ส่งมาตรง ๆ ไม่ format ใหม่ — รองรับทั้งวันที่จริง ("2026-10-01")
// และข้อความอื่น เช่น "เร็วๆ นี้"

export type VaccineNewsRow = {
  VaccineName?: string;
  StartDate?: string;
  EndDate?: string;
  Status?: boolean | string;
  Description?: string;
};

export type VaccineNewsItem = {
  id: string;
  vaccineName: string;
  startDate?: string;
  description?: string;
};

export function buildVaccineNewsFromRows(rows: VaccineNewsRow[]): VaccineNewsItem[] {
  return rows
    .filter((row) => String(row.VaccineName || "").trim() !== "")
    .map((row, i) => ({
      id: `vaccine-news-${i}`,
      vaccineName: row.VaccineName || "",
      startDate: row.StartDate,
      description: row.Description,
    }));
}

export default function VaccineNewsCards({ items }: { items: VaccineNewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="v2-vaccinenews-grid">
      {items.map((item) => (
        <article className="v2-vaccinenews-card" key={item.id}>
          <span className="v2-vaccinenews-tag">ข่าวสาร</span>
          {item.startDate && <span className="v2-vaccinenews-date">{item.startDate}</span>}
          <h3>{item.vaccineName}</h3>
          {item.description && <p>{item.description}</p>}
        </article>
      ))}
    </div>
  );
}
