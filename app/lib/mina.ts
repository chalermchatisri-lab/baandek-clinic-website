export type MinaPose = { open: string; closed?: string; alt: string };

// พูลท่ามีนาที่มีอยู่แล้วในโปรเจกต์ (ไม่ generate ภาพใหม่) — สลับตาม week number รายสัปดาห์
export const MINA_POSES: MinaPose[] = [
  {
    open: "https://lh3.googleusercontent.com/d/15AAWrAEPwQTCEUTqP9hEFijukKeeaNlH",
    closed: "https://lh3.googleusercontent.com/d/1hVl0DCQ0yUIxX3sWgMv1_C3Zjmu8y6cE",
    alt: "มาสคอตมีนากำลังชี้ชวนไปยังปุ่มด้านซ้าย",
  },
  { open: "/mascot/mina-pointing.png", alt: "มาสคอตมีนากำลังชี้ชวน" },
  { open: "/mascot/mina-reading.png", alt: "มาสคอตมีนากำลังอ่านหนังสือ" },
];

// เลขสัปดาห์ ISO ของปี (1-53) — คำนวณล้วน ไม่ต้องมี backend/database
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getWeeklyMinaPose(now: Date = new Date()): MinaPose {
  const week = getISOWeek(now);
  return MINA_POSES[week % MINA_POSES.length];
}
