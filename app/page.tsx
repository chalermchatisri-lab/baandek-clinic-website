"use client";

import { useEffect, useState } from "react";
import DinoLandStory from "./DinoLandStory";
import { buildEpisodeSeriesFromArticles } from "./dino-land-data";
import InfographicGallery, { buildInfographicsFromArticles } from "./InfographicGallery";
import VideoCards, { buildVideosFromArticles } from "./VideoCards";
import ArticleModal, { buildArticlesFromRows } from "./ArticleModal";
import VaccineNewsCards, { buildVaccineNewsFromRows } from "./VaccineNewsCard";
import { FALLBACK_LINKS, CONTENT_API_URL, formatPhone, fetchJsonWithRetry } from "./lib/links";
import { getWeeklyMinaPose } from "./lib/mina";

type ClinicStatus = { open: boolean; label: string; detail: string; source: string };
type DayHours = { day: string; sessions: { open: string; close: string }[] };
type HoursGroup = { label: string; text: string };

type TeamMember = { Name?: string; Role?: string; Photo_URL?: string; Credentials?: string; Order?: number };
type Service = { Title?: string; Description?: string; Icon?: string; Order?: number; Active?: boolean | string };
type Article = { Title?: string; Category?: string; Cover_Image_URL?: string; Content_Type?: string; Panel_Images_Folder?: string; Panel_Count?: number; Panel_Ext?: string; Series_Slug?: string; Published?: boolean | string; Body_Content?: string };
type Review = { Source?: string; Reviewer_Name?: string; Text?: string; Rating?: number; ReviewCount?: number; Screenshot_URL?: string; Permission_Confirmed?: boolean | string };
type Promotion = { Title?: string; Description?: string; Image_URL?: string; Start_Date?: string; End_Date?: string; Active?: boolean | string };
type VaccineNewsRow = { VaccineName?: string; StartDate?: string; EndDate?: string; Status?: boolean | string; Description?: string };
type ContentData = { team: TeamMember[]; services: Service[]; articles: Article[]; reviews: Review[]; promotions: Promotion[]; vaccineNews: VaccineNewsRow[]; links: Record<string, string> };

const emptyContentData: ContentData = { team: [], services: [], articles: [], reviews: [], promotions: [], vaccineNews: [], links: {} };

const THAI_DOW_SHORT: Record<string, string> = {
  Monday: "จ.", Tuesday: "อ.", Wednesday: "พ.", Thursday: "พฤ.",
  Friday: "ศ.", Saturday: "ส.", Sunday: "อา.",
};

// Groups consecutive weekdays that share the exact same session times into one
// line (e.g. Tue-Fri all "09:00-12:00 / 16:00-19:00" -> one "อ.-ศ." line),
// so the widget doesn't need to hardcode which days happen to match today.
function groupRegularHours(days: DayHours[]): HoursGroup[] {
  const groups: { days: string[]; text: string }[] = [];
  for (const d of days) {
    const text = d.sessions.map(s => `${s.open}–${s.close}`).join(" / ");
    const last = groups[groups.length - 1];
    if (last && last.text === text) {
      last.days.push(d.day);
    } else {
      groups.push({ days: [d.day], text });
    }
  }
  return groups.map(g => ({
    label: g.days.length > 1
      ? `${THAI_DOW_SHORT[g.days[0]]}–${THAI_DOW_SHORT[g.days[g.days.length - 1]]}`
      : THAI_DOW_SHORT[g.days[0]] ?? g.days[0],
    text: g.text,
  }));
}

// ใช้เฉพาะช่วงที่ยังโหลด /public/clinic-hours ไม่เสร็จ หรือโหลดไม่สำเร็จเท่านั้น —
// ค่าจริงมาจาก Supabase clinic_hours ผ่าน endpoint นั้นเสมอเมื่อโหลดสำเร็จ
const FALLBACK_REGULAR_HOURS: HoursGroup[] = [
  { label: "อ.–ศ.", text: "09:00–12:00 / 16:00–19:00" },
  { label: "ส.", text: "10:00–15:00" },
  { label: "อา.", text: "10:00–12:00" },
];

const fallbackStatus = (): ClinicStatus => {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const day = p.find(x => x.type === "weekday")?.value ?? "Mon";
  const t = Number(p.find(x => x.type === "hour")?.value ?? 0) * 60 + Number(p.find(x => x.type === "minute")?.value ?? 0);
  const open = day === "Sat" ? t >= 540 && t < 900 : day === "Sun" ? t >= 540 && t < 720 : day !== "Mon" && ((t >= 540 && t < 720) || (t >= 960 && t < 1140));
  return { open, label: open ? "ขณะนี้คลินิกเปิด" : "ขณะนี้คลินิกปิด", detail: open ? "พร้อมดูแลน้อง ๆ ตามเวลาทำการ" : "ตรวจสอบรอบถัดไปหรือโทรสอบถามก่อนมา", source: "คำนวณจากตารางเวลาปกติ" };
};

export default function Home() {
  const [status, setStatus] = useState<ClinicStatus>(fallbackStatus());
  const [regularHours, setRegularHours] = useState<HoursGroup[]>(FALLBACK_REGULAR_HOURS);
  const [content, setContent] = useState<ContentData>(emptyContentData);
  const [blinking, setBlinking] = useState(false);
  const minaPose = getWeeklyMinaPose();
  const scrollToStatus = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("status")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    if (!minaPose.closed) return; // ท่านี้ไม่มีภาพหลับตา ไม่ต้องเล่นแอนิเมชันกะพริบตา
    let blinkTimeout: ReturnType<typeof setTimeout>;
    let cycleTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function scheduleBlink() {
      const delayUntilBlink = 3000 + Math.random() * 3000; // 3–6 วินาที
      cycleTimeout = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        const blinkDuration = 150 + Math.random() * 50; // 150–200 มิลลิวินาที
        blinkTimeout = setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          scheduleBlink();
        }, blinkDuration);
      }, delayUntilBlink);
    }

    scheduleBlink();
    return () => {
      cancelled = true;
      clearTimeout(cycleTimeout);
      clearTimeout(blinkTimeout);
    };
  }, []);
  useEffect(() => {
    fetchJsonWithRetry("https://baandek-clinic.onrender.com/public/clinic-status")
      .then(data => {
        const c = data.clinic ?? data;
        const open = c.status === "OPEN" || Boolean(c.open ?? c.isOpen);
        const sessions = Array.isArray(c.sessions) ? c.sessions.map((s: {open?: string; close?: string}) => `${s.open}–${s.close}`).join(" / ") : "";
        setStatus({ open, label: open ? "ขณะนี้คลินิกเปิด" : "ขณะนี้คลินิกปิด", detail: [c.message, sessions].filter(Boolean).join(" • "), source: c.reason ? `ประกาศ: ${c.reason}` : "อัปเดตจากคลินิกล่าสุด" });
      }).catch(() => setStatus(fallbackStatus()));
  }, []);
  useEffect(() => {
    fetchJsonWithRetry("https://baandek-clinic.onrender.com/public/clinic-hours")
      .then(data => {
        const hours: DayHours[] = Array.isArray(data?.hours) ? data.hours : [];
        if (hours.length > 0) setRegularHours(groupRegularHours(hours));
      }).catch(() => setRegularHours(FALLBACK_REGULAR_HOURS));
  }, []);
  useEffect(() => {
    fetchJsonWithRetry(CONTENT_API_URL)
      .then(data => {
        if (!data || data.ok === false) return;
        setContent({
          team: Array.isArray(data.team) ? data.team : [],
          services: Array.isArray(data.services) ? data.services : [],
          articles: Array.isArray(data.articles) ? data.articles : [],
          reviews: Array.isArray(data.reviews) ? data.reviews : [],
          promotions: Array.isArray(data.promotions) ? data.promotions : [],
          vaccineNews: Array.isArray(data.vaccineNews) ? data.vaccineNews : [],
          links: (data.links && typeof data.links === "object") ? data.links : {}
        });
      })
      .catch(() => {});
  }, []);

  // ค่าจากชีตมาก่อนเสมอ ถ้ายังไม่มา/ว่าง ค่อยใช้ fallback ในโค้ด
  const link = (key: string) => content.links[key] || FALLBACK_LINKS[key] || "";

  // ชีตเก็บค่าดิบ (เบอร์/handle/LINE ID) แล้วประกอบเป็น URL/format ตรงนี้ — หลักการ
  // เดียวกับฝั่ง Apps Script (BotConfig.gs.js) เพื่อให้ทุกช่องทางแสดงผลเหมือนกันเป๊ะ
  const phoneRaw = formatPhone(link("PHONE")).replace(/-/g, "");
  const phoneDisplay = formatPhone(link("PHONE"));
  const fbHandle = link("FACEBOOK_PAGE");
  const facebookUrl = `https://www.facebook.com/${fbHandle}`;
  const messengerUrl = `https://m.me/${fbHandle}`;
  const lineOaUrl = `https://line.me/R/ti/p/${link("LINE_OA")}`;

  return <main className="v2">
    <header className="v2-nav">
      <a href="#home" className="v2-brand"><img src="/logo.jpg" alt="โลโก้คลินิกบ้านเด็ก"/><span>คลินิกบ้านเด็ก<small>BAANDEK CLINIC</small></span></a>
      <nav><a href="#services">บริการ</a><a href="#advisor">วัคซีน</a><a href="/about">สถานที่</a><a href="#knowledge">ความรู้</a><a href="#contact">ติดต่อ</a></nav>
      <a className="v2-call" href={`tel:${phoneRaw}`}>โทร {phoneDisplay}</a>
    </header>

    <section className="v2-hero" id="home">
      <div className="v2-hero-copy"><span className="v2-pill">กุมารแพทย์ • สุราษฎร์ธานี</span><h1>ดูแลทุกช่วงวัย<br/>ด้วยความเข้าใจ</h1><p>พื้นที่อุ่นใจสำหรับเด็ก ๆ และทุกครอบครัว<br/>ตั้งแต่วันแรกเกิดไปจนถึงวันที่เติบโตแข็งแรง</p><div className="v2-buttons"><a className="v2-btn solid" href="#status">ดูสถานะวันนี้</a><a className="v2-btn outline" href={messengerUrl}>สอบถามทาง Messenger</a></div></div>
      <div className="v2-hero-mascot"><span className="v2-mascot-blob"></span><img className={`v2-mascot-img${(minaPose.closed && blinking) ? " is-hidden" : ""}`} src={minaPose.open} alt={minaPose.alt}/>{minaPose.closed && <img className={`v2-mascot-img v2-mascot-blink${blinking ? "" : " is-hidden"}`} src={minaPose.closed} alt="" aria-hidden="true"/>}<div className="v2-photo-note"><b>คลินิกบ้านเด็ก</b><small>เปิดดูแลครอบครัวมาตั้งแต่ 18 พฤษภาคม 2562</small></div></div>
    </section>

    <section className="v2-status" id="status">
      <div className={`v2-status-icon ${status.open ? "is-open" : ""}`}>{status.open ? "✓" : "–"}</div><div><span>สถานะคลินิกวันนี้</span><h2>{status.label}</h2><p>{status.detail}</p><small>{status.source}</small></div><div className="v2-hours"><b>เวลาตรวจปกติ</b>{regularHours.map((g, i) => <span key={i}>{g.label} {g.text}</span>)}</div>
    </section>

    <section className="v2-actions" aria-label="ทางลัดสำคัญ">
      <a href={link("VACCINE_ADVISOR")} target="_blank" rel="noreferrer"><i>💉</i><b>เช็กวัคซีน</b><span>เลือกอายุและดูวัคซีน</span></a>
      <a href="#status" onClick={scrollToStatus}><i>🕘</i><b>เวลาเปิด</b><span>ดูสถานะจากคลินิก</span></a>
      <a href={link("GOOGLE_MAPS")} target="_blank" rel="noreferrer"><i>📍</i><b>แผนที่</b><span>นำทางด้วย Google Maps</span></a>
      <a href={`tel:${phoneRaw}`}><i>☎️</i><b>โทรหาเรา</b><span>{phoneDisplay}</span></a>
    </section>

    <section className="v2-services" id="services">
      <div className="v2-section-head"><span>บริการของเรา</span><h2>ครบทุกเรื่องสำคัญ<br/>ของสุขภาพเด็ก</h2><p>เราอธิบายให้เข้าใจง่าย รับฟังทุกความกังวล และช่วยครอบครัววางแผนการดูแลที่เหมาะกับลูกแต่ละคน</p></div>
      <div className="v2-service-grid">{content.services.map((svc, i) => <article key={`${svc.Title}-${i}`}><i>{svc.Icon}</i><h3>{svc.Title}</h3><p>{svc.Description}</p><a href={messengerUrl}>สอบถามเพิ่มเติม →</a></article>)}</div>
    </section>

    {content.team.length > 0 && <section className="v2-team" id="team">
      <div className="v2-section-head"><span>ทีมงานของเรา</span><h2>ดูแลด้วยทีมที่<br/>ไว้ใจได้</h2></div>
      <div className="v2-team-grid">{content.team.map((member, i) => (
        <div className="v2-team-card" key={`${member.Name}-${i}`}>
          <div className="v2-team-photo">{member.Photo_URL ? <img src={member.Photo_URL} alt={member.Name || ""}/> : <span>{(member.Name || "?").trim().charAt(0)}</span>}</div>
          <b>{member.Name}</b>
          {member.Role && <span>{member.Role}</span>}
          {member.Credentials && <small>{member.Credentials}</small>}
        </div>
      ))}</div>
    </section>}

    <section className="v2-advisor" id="advisor">
      <div className="v2-advisor-art"><img src="/mascot/mina-reading.png" alt="มาสคอตมีนากำลังอ่านหนังสือ Healthy Kids"/></div><div><span className="v2-pill dark">BAANDEK VACCINE ADVISOR</span><h2>เช็กวัคซีนตามวัย<br/>ได้ใน 10 วินาที</h2><p>เลือกอายุของน้อง ดูวัคซีนที่ควรได้รับ วัคซีนทางเลือก และราคาเบื้องต้นก่อนปรึกษากุมารแพทย์</p><ul><li>เลือกอายุได้ง่ายบนมือถือ</li><li>ดูวัคซีนและราคาในหน้าเดียว</li><li>ข้อมูลเชื่อมกับระบบของคลินิก</li></ul><a className="v2-btn solid" href={link("VACCINE_ADVISOR")} target="_blank" rel="noreferrer">เริ่มเช็กวัคซีน</a></div>
    </section>

    <section className="v2-knowledge" id="knowledge">{content.vaccineNews.length > 0 && <VaccineNewsCards items={buildVaccineNewsFromRows(content.vaccineNews)} />}{buildEpisodeSeriesFromArticles(content.articles).map((series) => (
      <DinoLandStory key={series.slug} episodes={series.episodes} heading={series.heading} />
    ))}<InfographicGallery items={buildInfographicsFromArticles(content.articles)} /><VideoCards items={buildVideosFromArticles(content.articles)} /><div className="v2-section-head"><span>ความรู้สำหรับครอบครัว</span><h2>อ่านง่าย ใช้ได้จริง<br/>จากคลินิกบ้านเด็ก</h2></div><ArticleModal items={buildArticlesFromRows(content.articles)} />{content.articles.filter(a => !["comic-story", "infographic", "video", "article"].includes(a.Content_Type || "")).length > 0 && <div className="v2-article-grid">{content.articles.filter(a => !["comic-story", "infographic", "video", "article"].includes(a.Content_Type || "")).map((article, i) => (
      <article key={`${article.Title}-${i}`}>
        {article.Cover_Image_URL && <img src={article.Cover_Image_URL} alt={article.Title || ""}/>}
        <span>{article.Category}</span>
        <h3>{article.Title}</h3>
      </article>
    ))}</div>}<a className="v2-fb" href={facebookUrl} target="_blank" rel="noreferrer">ติดตามบทความและประกาศบน Facebook →</a></section>

    {content.promotions.length > 0 && <section className="v2-promotions" id="promotions">
      <div className="v2-section-head"><span>โปรโมชั่น</span><h2>ข้อเสนอพิเศษ<br/>ที่กำลังใช้งานอยู่</h2></div>
      <div className="v2-promo-grid">{content.promotions.map((promo, i) => (
        <article key={`${promo.Title}-${i}`}>
          {promo.Image_URL && <img src={promo.Image_URL} alt={promo.Title || ""}/>}
          <h3>{promo.Title}</h3>
          <p>{promo.Description}</p>
        </article>
      ))}</div>
    </section>}

    <section className="v2-contact" id="contact"><div className="v2-review"><span>เสียงจากครอบครัว</span><h2>ความไว้วางใจ<br/>ที่เราให้ความสำคัญ</h2>{content.reviews.length > 0 ? content.reviews.map((review, i) => (
      <div className="v2-review-card" key={`${review.Reviewer_Name}-${i}`}>
        {review.Rating != null && <span className="v2-review-stars">{"★".repeat(Math.round(Number(review.Rating)))}{"☆".repeat(Math.max(0, 5 - Math.round(Number(review.Rating))))}{review.ReviewCount != null && ` (${review.Rating} จาก ${review.ReviewCount} รีวิว)`}</span>}
        <p>{review.Text}</p>
        <small>{[review.Reviewer_Name, review.Source].filter(Boolean).join(" · ")}</small>
        {review.Screenshot_URL && <a className="v2-review-link" href={review.Screenshot_URL} target="_blank" rel="noreferrer">ดูรีวิวทั้งหมดบน Google Maps →</a>}
      </div>
    )) : <div className="v2-review-card"><p>พื้นที่สำหรับรีวิวจริงจากผู้ปกครองที่อนุญาตให้นำมาเผยแพร่</p><small>จะเพิ่มในรอบเตรียมเผยแพร่เว็บไซต์</small></div>}</div><div className="v2-location"><span>มาพบเรา</span><h2>คลินิกบ้านเด็ก</h2><p>{link("ADDRESS")}</p><div><a href={link("GOOGLE_MAPS")} target="_blank" rel="noreferrer">เปิด Google Maps</a><a href={facebookUrl} target="_blank" rel="noreferrer">Facebook</a><a href={messengerUrl}>Messenger</a><a href={lineOaUrl} target="_blank" rel="noreferrer">LINE OA</a></div><a className="v2-phone" href={`tel:${phoneRaw}`}>{phoneDisplay}</a></div></section>
    <footer className="v2-footer"><span>© 2026 คลินิกบ้านเด็ก</span><span>ข้อมูลบนเว็บไซต์ไม่ทดแทนการตรวจวินิจฉัยโดยแพทย์</span></footer>
  </main>;
}
