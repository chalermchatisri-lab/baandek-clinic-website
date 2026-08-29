"use client";

import { useState } from "react";

// การ์ดภาพเดี่ยว (cover + ชื่อเรื่อง) กดแล้วเปิด lightbox เลื่อนดูภาพทั้งชุดทีละภาพ
// ต่างจาก DinoLandStory ตรงที่ไม่มี progress bar / จบตอนแล้วไปตอนต่อไป — แค่ภาพชุดเดียวปิดได้
// ข้อมูล (รายการรูป) มาจากชีต ARTICLES ที่ Content_Type === "infographic" เท่านั้น
// ARTICLES ไม่มีคอลัมน์เก็บรูปหลายรูป จึงใช้ Panel_Images_Folder เดิม เก็บเป็น
// "url1|url2|url3" คั่นด้วย | (ต่างจาก comic-story ที่ใช้ช่องนี้เป็น path โฟลเดอร์เดียว)

export type InfographicArticleRow = {
  Title?: string;
  Category?: string;
  Cover_Image_URL?: string;
  Content_Type?: string;
  Panel_Images_Folder?: string;
};

export type InfographicItem = {
  id: string;
  title: string;
  category?: string;
  images: string[];
};

export function buildInfographicsFromArticles(articles: InfographicArticleRow[]): InfographicItem[] {
  return articles
    .filter((row) => row.Content_Type === "infographic")
    .map((row, i) => {
      const images = String(row.Panel_Images_Folder || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

      return {
        id: `infographic-${i}`,
        title: row.Title || `บทความ ${i + 1}`,
        category: row.Category,
        images: images.length > 0 ? images : row.Cover_Image_URL ? [row.Cover_Image_URL] : [],
      };
    })
    .filter((item) => item.images.length > 0);
}

export default function InfographicGallery({ items }: { items: InfographicItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  const openItem = items.find((item) => item.id === openId) || null;

  function open(id: string) {
    setOpenId(id);
    setIdx(0);
  }

  function close() {
    setOpenId(null);
  }

  function next() {
    if (!openItem) return;
    setIdx((i) => Math.min(openItem.images.length - 1, i + 1));
  }

  function prev() {
    setIdx((i) => Math.max(0, i - 1));
  }

  if (items.length === 0) return null;

  return (
    <>
      <div className="v2-infographic-grid">
        {items.map((item) => (
          <button key={item.id} className="v2-infographic-card" onClick={() => open(item.id)}>
            <img src={item.images[0]} alt={item.title} />
            {item.category && <span>{item.category}</span>}
            <b>{item.title}</b>
          </button>
        ))}
      </div>

      {openItem && (
        <div className="v2-lightbox" role="dialog" aria-modal="true" aria-label={openItem.title}>
          <div className="v2-lightbox-top">
            <span>{openItem.title} · {idx + 1}/{openItem.images.length}</span>
            <button className="v2-lightbox-close" onClick={close} aria-label="ปิด">✕</button>
          </div>
          <div className="v2-lightbox-stage">
            <img src={openItem.images[idx]} alt={`${openItem.title} ภาพที่ ${idx + 1}`} />
            {idx > 0 && (
              <button className="v2-lightbox-nav left" onClick={prev} aria-label="ภาพก่อนหน้า">‹</button>
            )}
            {idx < openItem.images.length - 1 && (
              <button className="v2-lightbox-nav right" onClick={next} aria-label="ภาพถัดไป">›</button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
