"use client";

import { useState, Fragment } from "react";

// การ์ดบทความเต็ม (Content_Type="article") — การ์ดโชว์ cover + ชื่อเรื่องเหมือนการ์ด
// ความรู้ทั่วไป กดแล้วเปิด modal อ่านเนื้อหาเต็มจากคอลัมน์ Body_Content (เก็บเป็น markdown
// อย่างง่าย) render เองแบบจำกัด (heading/ตัวหนา/เส้นคั่น/quote) โดยไม่ใช้
// dangerouslySetInnerHTML และไม่พึ่ง library แปลง markdown เพิ่ม

export type ArticleRow = {
  Title?: string;
  Category?: string;
  Cover_Image_URL?: string;
  Content_Type?: string;
  Body_Content?: string;
};

export type ArticleItem = { id: string; title: string; category?: string; coverImage?: string; body: string };

export function buildArticlesFromRows(articles: ArticleRow[]): ArticleItem[] {
  return articles
    .filter((row) => row.Content_Type === "article")
    .map((row, i) => ({
      id: `article-${i}`,
      title: row.Title || `บทความ ${i + 1}`,
      category: row.Category,
      coverImage: row.Cover_Image_URL,
      body: row.Body_Content || "",
    }));
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

function renderBody(markdown: string) {
  const blocks = markdown.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return blocks.map((block, i) => {
    const key = `block-${i}`;
    if (block.startsWith("# ")) return null;
    if (block.startsWith("### ")) return <h4 key={key}>{renderInline(block.slice(4), key)}</h4>;
    if (block.startsWith("## ")) return <h3 key={key}>{renderInline(block.slice(3), key)}</h3>;
    if (block === "---") return <hr key={key} />;
    if (block.startsWith("> ")) {
      return <blockquote key={key}>{renderInline(block.replace(/^>\s?/gm, ""), key)}</blockquote>;
    }
    return <p key={key}>{renderInline(block, key)}</p>;
  });
}

export default function ArticleModal({ items }: { items: ArticleItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openItem = items.find((item) => item.id === openId) || null;

  if (items.length === 0) return null;

  return (
    <>
      <div className="v2-article-grid">
        {items.map((item) => (
          <article key={item.id} onClick={() => setOpenId(item.id)} className="v2-article-clickable">
            {item.coverImage && <img src={item.coverImage} alt={item.title} />}
            {item.category && <span>{item.category}</span>}
            <h3>{item.title}</h3>
          </article>
        ))}
      </div>

      {openItem && (
        <div className="v2-lightbox v2-article-modal" role="dialog" aria-modal="true" aria-label={openItem.title}>
          <div className="v2-lightbox-top">
            <span>{openItem.title}</span>
            <button className="v2-lightbox-close" onClick={() => setOpenId(null)} aria-label="ปิด">✕</button>
          </div>
          <div className="v2-article-modal-body">
            {openItem.coverImage && <img src={openItem.coverImage} alt={openItem.title} />}
            {renderBody(openItem.body)}
          </div>
        </div>
      )}
    </>
  );
}
