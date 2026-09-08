// ข้อมูลคอมมิค — metadata ต่อตอน (ชื่อ/โฟลเดอร์รูป) มาจากตาราง articles
// (content_type="comic-story") ไฟล์นี้เก็บแค่:
// 1. DINO_LAND_EPISODES — fallback เผื่อดึงข้อมูลไม่สำเร็จ/ยังโหลดไม่เสร็จ
// 2. buildEpisodeSeriesFromArticles — แปลงแถว articles ให้เป็น "ซีรีส์" หลายชุด
//    จัดกลุ่มด้วย series_slug เพื่อไม่ให้ปุ่ม "ตอนต่อไป"/carousel ปนข้ามซีรีส์กัน
//    (บั๊กที่เจอจริง: เอา comic-story ทุกแถวมาเรียงรวมเป็นเส้นเดียวตาม start_date เดิม —
//    พอมีซีรีส์ที่ 2 เพิ่มเข้ามา ลำดับตอนก็ปนกันมั่ว)

export type DinoLandPanel = {
  /** ลำดับช่อง เริ่มที่ 1 */
  index: number;
  /** path รูปภายใต้ /public */
  image: string;
  /** คำบรรยายช่องนี้ — ยังไม่ใส่ในรอบนี้ เผื่อไว้สำหรับตอนต่อ Sheet/CRUD */
  caption?: string;
};

export type DinoLandEpisode = {
  id: string;
  /** ลำดับตอน ใช้เรียงการ์ดเลือกตอน */
  order: number;
  title: string;
  subtitle: string;
  panels: DinoLandPanel[];
};

export type SeriesHeading = {
  pill: string;
  title: string;
  description: string;
};

export type ComicSeries = {
  slug: string;
  heading: SeriesHeading;
  episodes: DinoLandEpisode[];
};

const DEFAULT_HEADING: SeriesHeading = {
  pill: "คอมมิคความรู้",
  title: "Baandek Channel: ผจญภัยเอาชนะโรต้าไวรัส",
  description: "อ่านแบบ Story — แตะเลือกตอน แล้วปัดดูทีละช่องได้เลย",
};

// ข้อความหัวเรื่อง/คำโปรยต่อซีรีส์ — เป็นข้อความ UI ล้วน ๆ ไม่ใช่ตรรกะทางการแพทย์
// จึงเก็บเป็น map ในโค้ดได้ (ต่างจาก vaccine_rules ที่ต้องเป็น data)
const SERIES_HEADINGS: Record<string, SeriesHeading> = {
  "dino-land": DEFAULT_HEADING,
  "infection-precautions": {
    pill: "คอมมิคความรู้",
    title: "Baandek Channel: ป้องกันการติดเชื้อ",
    description: "อ่านแบบ Story — แตะเลือกตอน แล้วปัดดูทีละช่องได้เลย",
  },
};

const PANELS_PER_EPISODE = 9;

function buildPanels(folder: string, count: number, ext: string = "png"): DinoLandPanel[] {
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    image: `${folder}/panel-${String(i + 1).padStart(2, "0")}.${ext}`,
  }));
}

export const DINO_LAND_EPISODES: DinoLandEpisode[] = [
  {
    id: "ep1",
    order: 1,
    title: "EP1: เชื้อเข้ามาได้อย่างไร",
    subtitle: "ตอนที่ 1",
    panels: buildPanels("/knowledge/dino-land/ep1", PANELS_PER_EPISODE),
  },
  {
    id: "ep2",
    order: 2,
    title: "EP2: เกิดอะไรขึ้นในร่างกาย",
    subtitle: "ตอนที่ 2",
    panels: buildPanels("/knowledge/dino-land/ep2", PANELS_PER_EPISODE),
  },
  {
    id: "ep3",
    order: 3,
    title: "EP3: รักษาและป้องกันอย่างไร",
    subtitle: "ตอนที่ 3",
    panels: buildPanels("/knowledge/dino-land/ep3", PANELS_PER_EPISODE),
  },
];

export type ArticleRow = {
  Title?: string;
  Category?: string;
  Content_Type?: string;
  Panel_Images_Folder?: string;
  Panel_Count?: number;
  Panel_Ext?: string;
  Series_Slug?: string;
  Start_Date?: string;
};

/**
 * แปลงแถว articles ที่ Content_Type === "comic-story" ให้เป็นซีรีส์หลายชุด
 * จัดกลุ่มด้วย Series_Slug — แต่ละซีรีส์มี carousel/ปุ่ม "ตอนต่อไป" เป็นของตัวเอง
 * ไม่ปนกับซีรีส์อื่น (ลำดับตอนภายในซีรีส์เดียวกันอิงลำดับแถวที่ backend
 * เรียงมาให้แล้วด้วย priority/start_date)
 * ถ้ายังไม่มีแถว comic-story เลย (เช่น fetch ยังไม่เสร็จ/ล้มเหลว) ใช้ fallback เดิม
 */
export function buildEpisodeSeriesFromArticles(articles: ArticleRow[]): ComicSeries[] {
  const comicRows = articles.filter(
    (row) => row.Content_Type === "comic-story" && row.Panel_Images_Folder && row.Series_Slug
  );

  if (comicRows.length === 0) {
    return [{ slug: "dino-land", heading: DEFAULT_HEADING, episodes: DINO_LAND_EPISODES }];
  }

  const rowsBySlug = new Map<string, ArticleRow[]>();
  for (const row of comicRows) {
    const slug = row.Series_Slug as string;
    const bucket = rowsBySlug.get(slug);
    if (bucket) bucket.push(row);
    else rowsBySlug.set(slug, [row]);
  }

  // แถวที่ backend ส่งมาเรียงแบบ "feed ล่าสุดก่อน" (start_date DESC) เพื่อใช้กับ
  // การ์ดข่าว/infographic — แต่ลำดับตอนในคอมมิคต้องอ่านเก่าสุดก่อน (EP1 ก่อน EP2)
  // จึงต้องเรียงใหม่จากน้อยไปมากเฉพาะภายในซีรีส์นี้ ไม่งั้น "ตอนต่อไป" จะย้อนลำดับ
  for (const rows of rowsBySlug.values()) {
    rows.sort((a, b) => (a.Start_Date ?? "").localeCompare(b.Start_Date ?? ""));
  }

  return Array.from(rowsBySlug.entries()).map(([slug, rows]) => ({
    slug,
    heading: SERIES_HEADINGS[slug] ?? DEFAULT_HEADING,
    episodes: rows.map((row, i) => ({
      id: `ep${i + 1}`,
      order: i + 1,
      title: row.Title || `ตอนที่ ${i + 1}`,
      subtitle: row.Category || `ตอนที่ ${i + 1}`,
      panels: buildPanels(
        row.Panel_Images_Folder as string,
        row.Panel_Count ?? PANELS_PER_EPISODE,
        row.Panel_Ext ?? "png"
      ),
    })),
  }));
}
