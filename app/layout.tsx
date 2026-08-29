import type { Metadata } from "next";
import "./globals.css";

// หมายเหตุ: เดิมที่นี่ import Geist/Geist_Mono จาก next/font/google และตั้งเป็น CSS
// variable (--font-geist-sans/--font-geist-mono) บน <body> ตามโครง template เริ่มต้นของ
// Next.js แต่ globals.css กำหนดฟอนต์เองทุกจุดอยู่แล้ว ("Noto Sans Thai"/Tahoma/Georgia/
// "Noto Serif Thai") และไม่มีที่ไหนอ้าง var(--font-geist-*) เลยแม้แต่จุดเดียว — ผลคือ
// ดาวน์โหลด woff2 11 ไฟล์ (~143 KB) ทุกครั้งที่เปิดเว็บโดยไม่ได้ใช้แสดงผลเลย จึงเอาออก
// ถ้าอนาคตจะใช้ฟอนต์ละติน ให้ import กลับมาแล้ว "ใช้ตัวแปรนั้นใน globals.css จริงๆ" ด้วย
// ไม่งั้นจะกลับไปเป็นภาระโหลดเปล่าเหมือนเดิม (ดู scripts/fix-vinext-font-urls.mjs ประกอบ)

export const metadata: Metadata = {
  title: "คลินิกบ้านเด็ก | BAANDEK Clinic สุราษฎร์ธานี",
  description: "คลินิกกุมารเวชกรรม ดูแลสุขภาพเด็ก ตรวจโรคทั่วไป วัคซีน และพัฒนาการเด็ก จังหวัดสุราษฎร์ธานี",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
