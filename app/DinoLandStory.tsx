"use client";

import { useEffect, useState } from "react";
import type { DinoLandEpisode, SeriesHeading } from "./dino-land-data";

// UI สำหรับคอมมิคแบบ Story (แบบ Instagram/TikTok: progress bar ด้านบน, แตะซ้าย/ขวาเลื่อนช่อง)
// ใช้ซ้ำได้กับหลายซีรีส์ — แต่ละซีรีส์ต้อง render เป็นคนละ instance ของ component นี้
// (episodes ที่ส่งเข้ามาต้องเป็นของซีรีส์เดียวเท่านั้น ไม่งั้นปุ่ม "ตอนต่อไป" จะปนข้ามซีรีส์)
// ข้อมูล (path รูป/ชื่อตอน) มาจาก dino-land-data.ts ทั้งหมด — ไฟล์นี้จัดการแค่ UI/state

const DEFAULT_HEADING: SeriesHeading = {
  pill: "คอมมิคความรู้",
  title: "Baandek Channel: ผจญภัยเอาชนะโรต้าไวรัส",
  description: "อ่านแบบ Story — แตะเลือกตอน แล้วปัดดูทีละช่องได้เลย",
};

export default function DinoLandStory({
  episodes,
  heading = DEFAULT_HEADING,
}: {
  episodes: DinoLandEpisode[];
  heading?: SeriesHeading;
}) {
  const [openEpisodeId, setOpenEpisodeId] = useState<string | null>(null);
  const [panelIdx, setPanelIdx] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const openIndex = episodes.findIndex((e) => e.id === openEpisodeId);
  const openEpisode = openIndex >= 0 ? episodes[openIndex] : null;
  const nextEpisode = openIndex >= 0 ? episodes[openIndex + 1] : undefined;

  function startEpisode(id: string) {
    setOpenEpisodeId(id);
    setPanelIdx(0);
    setShowEndScreen(false);
  }

  function close() {
    setOpenEpisodeId(null);
    setShowEndScreen(false);
  }

  function goNext() {
    if (!openEpisode) return;
    if (panelIdx < openEpisode.panels.length - 1) {
      setPanelIdx((i) => i + 1);
    } else {
      setShowEndScreen(true);
    }
  }

  function goPrev() {
    if (showEndScreen) {
      setShowEndScreen(false);
      return;
    }
    setPanelIdx((i) => Math.max(0, i - 1));
  }

  // ปุ่มลูกศรบนคีย์บอร์ด + Esc ปิด — สะดวกเวลาดูบนคอม
  useEffect(() => {
    if (!openEpisode) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openEpisode, panelIdx, showEndScreen]);

  return (
    <>
      <div className="v2-dino-comic">
        <div className="v2-dino-comic-head">
          <span className="v2-pill">{heading.pill}</span>
          <h3>{heading.title}</h3>
          <p>{heading.description}</p>
        </div>
        <div className="v2-dino-comic-eps">
          {episodes.map((ep) => (
            <button key={ep.id} className="v2-dino-ep-btn" onClick={() => startEpisode(ep.id)}>
              <img src={ep.panels[0]?.image} alt={ep.title} />
              <span>{ep.subtitle}</span>
              <b>{ep.title}</b>
            </button>
          ))}
        </div>
      </div>

      {openEpisode && (
        <div className="v2-story" role="dialog" aria-modal="true" aria-label={openEpisode.title}>
          <div className="v2-story-bars">
            {openEpisode.panels.map((p) => (
              <span
                key={p.index}
                className={`v2-story-bar${
                  showEndScreen || p.index - 1 < panelIdx
                    ? " is-done"
                    : p.index - 1 === panelIdx
                    ? " is-current"
                    : ""
                }`}
              />
            ))}
          </div>

          <div className="v2-story-top">
            <span>{openEpisode.title}</span>
            <button className="v2-story-close" onClick={close} aria-label="ปิด">✕</button>
          </div>

          {!showEndScreen ? (
            <div className="v2-story-stage">
              <img src={openEpisode.panels[panelIdx].image} alt={`${openEpisode.title} ช่อง ${panelIdx + 1}`} />
              <button className="v2-story-zone left" onClick={goPrev} aria-label="ช่องก่อนหน้า" />
              <button className="v2-story-zone right" onClick={goNext} aria-label="ช่องถัดไป" />
            </div>
          ) : (
            <div className="v2-story-end">
              <b>จบ {openEpisode.title}</b>
              <div className="v2-story-end-actions">
                {nextEpisode && (
                  <button className="v2-btn solid" onClick={() => startEpisode(nextEpisode.id)}>
                    ไปตอนต่อไป: {nextEpisode.subtitle}
                  </button>
                )}
                <button className="v2-btn outline" onClick={close}>
                  ปิดกลับหน้าเว็บ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
