// ข้อมูลคอมมิค "Dinosaur Land" — ตอนนี้ metadata ต่อตอน (ชื่อ/โฟลเดอร์รูป) ย้ายไปอยู่ใน
// ชีต ARTICLES แล้ว (Content_Type="comic-story") ไฟล์นี้เก็บแค่:
// 1. DINO_LAND_EPISODES — fallback เผื่อดึงจากชีตไม่สำเร็จ/ยังโหลดไม่เสร็จ
// 2. buildEpisodesFromArticles — แปลงแถว ARTICLES จากชีตให้เป็นรูปแบบที่ DinoLandStory ใช้
// จำนวนช่อง (9 ช่อง/ตอน) และชื่อไฟล์ panel-01..09.png ยังเป็นค่าคงที่ในโค้ด เพราะผูกกับ
// ไฟล์รูปจริงที่ deploy ไว้แล้วบน /public — เพิ่มช่องใหม่ต้องอัปโหลดไฟล์ + แก้โค้ดอยู่ดี
// ไม่ต่างจากการแก้ข้อความอื่น ๆ ที่ดึงจากชีตได้เลย

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
};

/**
 * แปลงแถว ARTICLES ที่ Content_Type === "comic-story" ให้เป็น DinoLandEpisode[]
 * ลำดับตอนอิงจากลำดับแถวในชีต (ARTICLES ไม่มีคอลัมน์ Order)
 * ถ้ายังไม่มีแถว comic-story เลย (เช่น fetch ยังไม่เสร็จ/ล้มเหลว) ใช้ fallback เดิม
 */
export function buildEpisodesFromArticles(articles: ArticleRow[]): DinoLandEpisode[] {
  const comicRows = articles.filter(
    (row) => row.Content_Type === "comic-story" && row.Panel_Images_Folder
  );

  if (comicRows.length === 0) {
    return DINO_LAND_EPISODES;
  }

  return comicRows.map((row, i) => ({
    id: `ep${i + 1}`,
    order: i + 1,
    title: row.Title || `ตอนที่ ${i + 1}`,
    subtitle: row.Category || `ตอนที่ ${i + 1}`,
    panels: buildPanels(
      row.Panel_Images_Folder as string,
      row.Panel_Count ?? PANELS_PER_EPISODE,
      row.Panel_Ext ?? "png"
    ),
  }));
}
