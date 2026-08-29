// การ์ดวิดีโอ (Content_Type="video") — ฝัง YouTube iframe ตรงในการ์ดเลย ไม่ใช้ lightbox
// จำกัดแสดงพร้อมกันไม่เกิน 2 รายการ (กัน iframe เยอะเกินไปทำให้หน้าเว็บหนัก) และกรอง
// เฉพาะ Published=TRUE เท่านั้น — จะเปลี่ยนวิดีโอในอนาคตให้ปิด Published แถวเก่าแทนการลบ
// Panel_Images_Folder เก็บ YouTube video ID ล้วน ๆ (ไม่ใช่ URL เต็ม)

const MAX_VIDEOS = 2;

export type VideoArticleRow = {
  Title?: string;
  Content_Type?: string;
  Panel_Images_Folder?: string;
  Published?: boolean | string;
};

function isPublished(value: boolean | string | undefined): boolean {
  if (value === true) return true;
  return String(value || "").trim().toUpperCase() === "TRUE";
}

export type VideoItem = { id: string; title: string; videoId: string };

export function buildVideosFromArticles(articles: VideoArticleRow[]): VideoItem[] {
  return articles
    .filter((row) => row.Content_Type === "video" && isPublished(row.Published) && row.Panel_Images_Folder)
    .slice(0, MAX_VIDEOS)
    .map((row, i) => ({
      id: `video-${i}`,
      title: row.Title || `วิดีโอ ${i + 1}`,
      videoId: String(row.Panel_Images_Folder).trim(),
    }));
}

export default function VideoCards({ items }: { items: VideoItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="v2-video-grid">
      {items.map((item) => (
        <div className="v2-video-card" key={item.id}>
          <div className="v2-video-embed">
            <iframe
              src={`https://www.youtube.com/embed/${item.videoId}`}
              title={item.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <b>{item.title}</b>
        </div>
      ))}
    </div>
  );
}
