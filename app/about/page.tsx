"use client";

import { useEffect, useState } from "react";
import LocationGallery, { LocationZone } from "../LocationGallery";
import { FALLBACK_LINKS, CONTENT_API_URL, formatPhone, fetchJsonWithRetry } from "../lib/links";

const ZONES: LocationZone[] = [
  {
    slug: "exterior",
    title: "ภายนอกคลินิก",
    caption: "คลินิกสีเขียวอบอุ่น ต้อนรับทุกครอบครัวตั้งแต่ก้าวแรก",
    images: [
      { src: "/about/exterior/01-hero-day.webp", alt: "ภายนอกคลินิกบ้านเด็กในเวลากลางวัน" },
      { src: "/about/exterior/02-front-entrance.webp", alt: "ทางเข้าด้านหน้าคลินิกบ้านเด็ก" },
      { src: "/about/exterior/03-family-arrival.webp", alt: "ครอบครัวเดินทางมาถึงคลินิกบ้านเด็ก" },
      { src: "/about/exterior/04-golden-hour.webp", alt: "คลินิกบ้านเด็กในบรรยากาศยามเย็น" },
      { src: "/about/exterior/05-night.webp", alt: "คลินิกบ้านเด็กในเวลากลางคืน" },
    ],
  },
  {
    slug: "reception",
    title: "ต้อนรับ",
    caption: "จุดต้อนรับที่อบอุ่นเป็นกันเอง พร้อมมุมถ่ายรูปกับมีนา",
    images: [
      { src: "/about/reception/01-hero.webp", alt: "จุดต้อนรับคลินิกบ้านเด็ก" },
      { src: "/about/reception/02-counter.webp", alt: "เคาน์เตอร์ต้อนรับคลินิกบ้านเด็ก" },
      { src: "/about/reception/03-photo-wall.webp", alt: "มุมถ่ายรูปกับมาสคอตมีนา" },
      { src: "/about/reception/04-play-corner.webp", alt: "มุมเล่นสำหรับเด็กบริเวณต้อนรับ" },
      { src: "/about/reception/05-queue-system.webp", alt: "ระบบคิวบริเวณต้อนรับ" },
    ],
  },
  {
    slug: "waiting",
    title: "ห้องรอตรวจ",
    caption: "พื้นที่รอตรวจสบายๆ เหมาะทั้งเด็กและผู้ปกครอง",
    images: [{ src: "/about/waiting/01-hero.webp", alt: "ห้องรอตรวจคลินิกบ้านเด็ก" }],
  },
  {
    slug: "exam-room",
    title: "ห้องตรวจ",
    caption: "ห้องตรวจส่วนตัว ดูแลโดยแพทย์ผู้เชี่ยวชาญ",
    images: [
      { src: "/about/exam-room/01-doctor-mhee.webp", alt: "ห้องตรวจ หมอหมี" },
      { src: "/about/exam-room/02-doctor-joy.webp", alt: "ห้องตรวจ หมอจอย" },
    ],
  },
  {
    slug: "vaccination",
    title: "ห้องวัคซีน",
    caption: "พร้อมดูแลทุกขั้นตอนการฉีดวัคซีนอย่างปลอดภัย",
    images: [{ src: "/about/vaccination/01-hero.webp", alt: "ห้องฉีดวัคซีนคลินิกบ้านเด็ก" }],
  },
  {
    slug: "pharmacy",
    title: "เภสัชกรรม",
    caption: "คำแนะนำการใช้ยาที่เข้าใจง่ายจากเภสัชกร",
    images: [{ src: "/about/pharmacy/01-hero.webp", alt: "จุดจ่ายยาคลินิกบ้านเด็ก" }],
  },
  {
    slug: "development-room",
    title: "ห้องประเมินพัฒนาการ",
    caption: "ประเมินและส่งเสริมพัฒนาการเด็กแต่ละช่วงวัย",
    images: [{ src: "/about/development-room/01-hero.webp", alt: "ห้องประเมินพัฒนาการเด็ก" }],
  },
  {
    slug: "procedure-room",
    title: "ห้องหัตถการ",
    caption: "พร้อมรับมือทุกสถานการณ์ฉุกเฉินอย่างมืออาชีพ",
    images: [{ src: "/about/procedure-room/01-hero.webp", alt: "ห้องหัตถการคลินิกบ้านเด็ก" }],
  },
];

export default function AboutPage() {
  const [links, setLinks] = useState<Record<string, string>>({});
  useEffect(() => {
    fetchJsonWithRetry(CONTENT_API_URL)
      .then(data => { if (data && data.ok !== false && data.links) setLinks(data.links); })
      .catch(() => {});
  }, []);

  const link = (key: string) => links[key] || FALLBACK_LINKS[key] || "";
  const phoneRaw = formatPhone(link("PHONE")).replace(/-/g, "");
  const phoneDisplay = formatPhone(link("PHONE"));
  const fbHandle = link("FACEBOOK_PAGE");
  const messengerUrl = `https://m.me/${fbHandle}`;

  return <main className="v2">
    <header className="v2-nav">
      <a href="/" className="v2-brand"><img src="/logo.jpg" alt="โลโก้คลินิกบ้านเด็ก"/><span>คลินิกบ้านเด็ก<small>BAANDEK CLINIC</small></span></a>
      <nav><a href="/#services">บริการ</a><a href="/#advisor">วัคซีน</a><a href="/about" aria-current="page">สถานที่</a><a href="/#knowledge">ความรู้</a><a href="/#contact">ติดต่อ</a></nav>
      <a className="v2-call" href={`tel:${phoneRaw}`}>โทร {phoneDisplay}</a>
    </header>

    <section className="v2-about-hero">
      <img src="/about/exterior/01-hero-day.webp" alt="ภายนอกคลินิกบ้านเด็กในเวลากลางวัน" />
      <div className="v2-about-hero-overlay">
        <span className="v2-pill">สถานที่ • บรรยากาศคลินิก</span>
        <h1>พื้นที่อุ่นใจ<br/>ที่ออกแบบมาเพื่อลูกของคุณ</h1>
        <p>ตั้งแต่ก้าวแรกที่มาถึงจนถึงวันที่กลับบ้านอย่างสบายใจ<br/>ทุกมุมของคลินิกบ้านเด็กตั้งใจดูแลทั้งเด็กและผู้ปกครอง</p>
      </div>
    </section>

    <section className="v2-zone-section">
      <LocationGallery zones={ZONES} />
    </section>

    <section className="v2-about-cta">
      <h2>พร้อมพาน้องมาพบเราหรือยัง?</h2>
      <p>จองคิวล่วงหน้าหรือทักมาสอบถามได้ทุกช่องทาง</p>
      <div className="v2-buttons">
        <a className="v2-btn solid" href="/#status">จองคิว</a>
        <a className="v2-btn outline" href={messengerUrl}>สอบถามทาง Messenger</a>
      </div>
    </section>

    <footer className="v2-footer"><span>© 2026 คลินิกบ้านเด็ก</span><span>ข้อมูลบนเว็บไซต์ไม่ทดแทนการตรวจวินิจฉัยโดยแพทย์</span></footer>
  </main>;
}
