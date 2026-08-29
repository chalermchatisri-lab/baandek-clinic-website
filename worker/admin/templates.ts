/**
 * Admin Panel — HTML templates (vanilla HTML/CSS/JS, ไม่พึ่ง React/Next.js เลย)
 * ตั้งใจแยกขาดจาก app/page.tsx (Landing Page V2) โดยสิ้นเชิง ตามที่ผู้ใช้ระบุไว้
 */

const PAGE_STYLE = `
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: -apple-system, "Segoe UI", "Noto Sans Thai", Tahoma, sans-serif;
    background: #f4f6f8; color: #1f2937;
  }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .login-card {
    background: #fff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    width: 100%; max-width: 360px;
  }
  .login-card h1 { font-size: 20px; margin: 0 0 24px; text-align: center; }
  .login-card input {
    width: 100%; padding: 12px 14px; border: 1px solid #d1d5db; border-radius: 8px;
    font-size: 15px; margin-bottom: 12px;
  }
  .login-card button, .btn {
    width: 100%; padding: 12px 14px; border: none; border-radius: 8px; background: #2563eb;
    color: #fff; font-size: 15px; font-weight: 600; cursor: pointer;
  }
  .login-card button:hover, .btn:hover { background: #1d4ed8; }
  .error-text { color: #dc2626; font-size: 13px; margin: 0 0 12px; min-height: 16px; }

  .app-header {
    background: #fff; border-bottom: 1px solid #e5e7eb; padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .app-header h1 { font-size: 18px; margin: 0; }
  .logout-link { color: #6b7280; text-decoration: none; font-size: 14px; }
  .tabs { display: flex; gap: 4px; padding: 12px 24px 0; background: #fff; border-bottom: 1px solid #e5e7eb; }
  .tab-btn {
    padding: 10px 18px; border: none; background: none; font-size: 14px; cursor: pointer;
    border-bottom: 3px solid transparent; color: #6b7280; font-weight: 500;
  }
  .tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; }
  main { padding: 24px; max-width: 1100px; margin: 0 auto; }

  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  th, td { padding: 10px 12px; border-bottom: 1px solid #f0f1f3; text-align: left; font-size: 14px; vertical-align: middle; }
  th { background: #f9fafb; font-weight: 600; color: #4b5563; font-size: 13px; }
  tr.dirty td { background: #fffbea; }
  input[type=text], input[type=number], select, textarea {
    padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; width: 100%;
  }
  textarea { min-height: 60px; font-family: inherit; }
  .row-save-btn {
    padding: 6px 14px; border: none; border-radius: 6px; background: #2563eb; color: #fff;
    font-size: 13px; cursor: pointer;
  }
  .row-save-btn:disabled { background: #9ca3af; cursor: default; }
  .sub-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
  .sub-tab-btn {
    padding: 8px 16px; border: 1px solid #d1d5db; background: #fff; border-radius: 999px;
    font-size: 13px; cursor: pointer; color: #4b5563;
  }
  .sub-tab-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
  .add-new-btn { margin-bottom: 12px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex;
    align-items: center; justify-content: center; padding: 20px; z-index: 50;
  }
  .modal-card {
    background: #fff; border-radius: 10px; padding: 24px; max-width: 520px; width: 100%;
    max-height: 90vh; overflow-y: auto;
  }
  .modal-card h2 { margin: 0 0 16px; font-size: 17px; }
  .form-field { margin-bottom: 14px; }
  .form-field label { display: block; font-size: 13px; color: #4b5563; margin-bottom: 4px; font-weight: 500; }
  .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }
  .btn-secondary { background: #e5e7eb; color: #1f2937; }
  .btn-secondary:hover { background: #d1d5db; }
  .preview-box {
    background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px;
    font-size: 13px; margin-top: 12px; white-space: pre-wrap;
  }
  .dose-block { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 10px; position: relative; }
  .dose-block-title { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
  .dose-remove-btn {
    position: absolute; top: 10px; right: 10px; border: none; background: none;
    color: #dc2626; font-size: 12px; cursor: pointer;
  }
  .add-dose-btn {
    width: 100%; padding: 8px; border: 1px dashed #d1d5db; border-radius: 8px; background: #f9fafb;
    color: #4b5563; font-size: 13px; cursor: pointer; margin-bottom: 14px;
  }

  .toast-container { position: fixed; bottom: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px; z-index: 100; }
  .toast {
    padding: 12px 18px; border-radius: 8px; color: #fff; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    animation: toast-in 0.2s ease-out;
  }
  .toast.success { background: #16a34a; }
  .toast.error { background: #dc2626; }
  @keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .loading-text { color: #6b7280; font-size: 14px; padding: 24px; text-align: center; }
`;

export function renderLoginPage(errorMessage?: string): string {
  return `
    <style>${PAGE_STYLE}</style>
    <div class="login-wrap">
      <form class="login-card" method="POST" action="/admin/login">
        <h1>Baandek Clinic — Admin Panel</h1>
        <p class="error-text">${errorMessage ? escapeHtml(errorMessage) : ""}</p>
        <input type="password" name="password" placeholder="รหัสผ่าน" autofocus required />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  `;
}

export function renderAdminShell(): string {
  return `
    <style>${PAGE_STYLE}</style>
    <div class="app-header">
      <h1>Baandek Clinic — Admin Panel</h1>
      <a class="logout-link" href="#" onclick="doLogout(); return false;">ออกจากระบบ</a>
    </div>
    <div class="tabs" id="tabs"></div>
    <main id="main-content"><p class="loading-text">กำลังโหลด...</p></main>
    <div class="toast-container" id="toast-container"></div>
    <script>${ADMIN_CLIENT_SCRIPT}</script>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Client-side JS ทั้งหมดของ Admin Panel — vanilla JS ธรรมดา ไม่มี build step
 * โครงสร้าง: TABS ระบุ tab หลัก 4 อัน, SHEET_UI_CONFIG ระบุว่าแต่ละชีตมีคอลัมน์ไหน
 * แก้ได้บ้างและควรแสดงเป็น input ชนิดไหน (ใช้แค่ตกแต่ง UI — การบังคับจริงอยู่ฝั่ง
 * Apps Script's AdminApi.gs.js เท่านั้น)
 */
const ADMIN_CLIENT_SCRIPT = `
const TABS = [
  { key: 'VACCINES', label: 'วัคซีน' },
  { key: 'TEAM', label: 'ทีมงาน' },
  { key: 'PROMOS_GROUP', label: 'โปรโมชั่น' },
  { key: 'REVIEWS', label: 'รีวิว' },
  { key: 'CLINIC_HOURS', label: 'เวลาทำการ' },
  { key: 'AGE_GUIDE', label: 'ช่วงอายุ' },
  { key: 'VACCINE_RULES', label: 'กฎวัคซีน' },
  { key: 'DISEASE_GROUP', label: 'กลุ่มโรค' },
  { key: 'VACCINE_NEWS', label: 'ข่าวสารวัคซีน' },
  { key: 'ARTICLES', label: 'บทความ' },
  { key: 'CLOSURES', label: 'วันปิดทำการ' }
];

const SHEET_UI_CONFIG = {
  // แก้แถวเดิมได้แค่ Price/Status (ล็อกเหมือนเดิม — และ Apps Script sync ให้ทุกแถวที่
  // VaccineID เดียวกันโดยอัตโนมัติ เพราะ Price/Status เป็นคุณสมบัติของวัคซีนทั้งตัว
  // ไม่ใช่ของเข็มใดเข็มหนึ่ง) VaccineName/AgeGroup/DoseName แสดงเป็น read-only เพิ่ม
  // เพื่อให้เห็นว่าแต่ละแถวคือ "คนละเข็ม" ของวัคซีนเดียวกัน ไม่ใช่แถวซ้ำ — เพิ่มวัคซีนใหม่
  // ใช้ multiDoseCreate (ฟอร์มแยก openVaccineCreateForm) กรอกข้อมูลร่วม (sharedFields)
  // ครั้งเดียวแล้วเพิ่มได้หลายเข็มในคราวเดียว (doseFields ต่อเข็ม)
  VACCINES: {
    inline: true,
    creatable: true,
    multiDoseCreate: true,
    columns: [
      { key: 'VaccineName', label: 'ชื่อแบรนด์', editable: false },
      { key: 'VaccineNameT', label: 'ชื่อวัคซีน (ไทย)', editable: false },
      { key: 'AgeGroup', label: 'ช่วงอายุ', editable: false },
      { key: 'DoseName', label: 'เข็มที่', editable: false },
      { key: 'Price', label: 'ราคา', editable: true, type: 'number' },
      { key: 'Status', label: 'สถานะ', editable: true, type: 'select', options: ['ACTIVE', 'INACTIVE'] }
    ],
    sharedFields: [
      { key: 'VaccineID', label: 'รหัสวัคซีน (VaccineID) — ใช้รหัสเดียวกันได้ทุกเข็ม', type: 'text', required: true },
      { key: 'VaccineName', label: 'ชื่อวัคซีน (อังกฤษ/แบรนด์)', type: 'text', required: true },
      { key: 'VaccineNameT', label: 'ชื่อวัคซีน (ไทย)', type: 'text', required: true },
      { key: 'Category', label: 'หมวดหมู่ (Category)', type: 'text', required: true },
      { key: 'Price', label: 'ราคา (ใช้ราคาเดียวกันทุกเข็ม)', type: 'text', required: true },
      { key: 'Status', label: 'สถานะ', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
      { key: 'GROUP', label: 'กลุ่มโรค (GROUP)', type: 'text' },
      { key: 'Description', label: 'คำอธิบาย', type: 'textarea' },
      { key: 'CatchUp', label: 'คำแนะนำกรณีรับล่าช้า', type: 'textarea' },
      { key: 'Recommendation', label: 'คำแนะนำ', type: 'textarea' },
      { key: 'Warning', label: 'คำเตือน', type: 'textarea' },
      { key: 'Priority', label: 'ระดับความสำคัญ (Priority)', type: 'text' },
      { key: 'ProductCode', label: 'รหัสสินค้า (ProductCode)', type: 'text' }
    ],
    doseFields: [
      { key: 'AgeGroup', label: 'ช่วงอายุ (AgeGroup)', type: 'text', required: true },
      { key: 'DoseName', label: 'ชื่อเข็ม (เช่น เข็มที่ 1)', type: 'text' },
      { key: 'DisplayOrder', label: 'ลำดับแสดงผล', type: 'text' }
    ]
  },
  TEAM: {
    inline: true,
    creatable: true,
    columns: [
      { key: 'Name', label: 'ชื่อ', editable: true, type: 'text' },
      { key: 'Role', label: 'ตำแหน่ง', editable: true, type: 'text' },
      { key: 'Order', label: 'ลำดับ', editable: true, type: 'number' },
      { key: 'Active', label: 'แสดงผล', editable: true, type: 'checkbox' }
    ],
    formFields: [
      { key: 'Name', label: 'ชื่อ', type: 'text', required: true },
      { key: 'Role', label: 'ตำแหน่ง', type: 'text' },
      { key: 'Order', label: 'ลำดับ', type: 'text' },
      { key: 'Active', label: 'แสดงผล', type: 'select', options: ['TRUE', 'FALSE'] }
    ]
  },
  REVIEWS: {
    inline: true,
    columns: [
      { key: 'Rating', label: 'คะแนนรวม', editable: true, type: 'number' },
      { key: 'ReviewCount', label: 'จำนวนรีวิว', editable: true, type: 'number' },
      { key: 'Text', label: 'ข้อความสรุป', editable: true, type: 'textarea' }
    ]
  },
  CLINIC_HOURS: {
    inline: true,
    columns: [
      { key: 'Day', label: 'วัน', editable: false },
      { key: 'Session', label: 'ช่วง', editable: false },
      { key: 'Open', label: 'เปิด (HH:mm)', editable: true, type: 'text' },
      { key: 'Close', label: 'ปิด (HH:mm)', editable: true, type: 'text' },
      { key: 'Status', label: 'สถานะ', editable: true, type: 'select', options: ['OPEN', 'CLOSED'] }
    ]
  },
  AGE_GUIDE: {
    inline: true,
    columns: [
      { key: 'AgeCode', label: 'รหัสอายุ (AgeCode)', editable: true, type: 'text' },
      { key: 'DisplayName', label: 'ชื่อที่แสดง', editable: true, type: 'text' },
      { key: 'SortOrder', label: 'ลำดับ', editable: true, type: 'number' }
    ]
  },
  // เสี่ยงสูงสุด — คอลัมน์ที่ไม่ใช่ Status/DisplayMessage ต้อง editable:false เท่านั้น
  // (แสดงให้ดูได้ แต่แก้ไม่ได้) safeguard จริงอยู่ฝั่ง Apps Script (AdminApi.gs.js)
  // ไม่ใช่ที่นี่ — ต่อให้ลืมตั้ง editable:false ผิดที่นี่ Apps Script ก็ยัง reject เองอยู่ดี
  VACCINE_RULES: {
    inline: true,
    columns: [
      { key: 'RuleID', label: 'รหัสกฎ (RuleID)', editable: false },
      { key: 'MinAgeMonths', label: 'อายุต่ำสุด (เดือน)', editable: false },
      { key: 'MaxAgeMonths', label: 'อายุสูงสุด (เดือน)', editable: false },
      { key: 'PrimaryDoses', label: 'จำนวนเข็มหลัก', editable: false },
      { key: 'IntervalDays', label: 'ระยะห่าง (วัน)', editable: false },
      { key: 'BoosterRule', label: 'กฎเข็มกระตุ้น', editable: false },
      { key: 'Eligibility', label: 'เกณฑ์คุณสมบัติ', editable: false },
      { key: 'RequiresHistory', label: 'ต้องดูประวัติ', editable: false },
      { key: 'DoctorReview', label: 'แพทย์พิจารณา', editable: false },
      { key: 'Status', label: 'สถานะ', editable: true, type: 'select', options: ['ACTIVE', 'INACTIVE'] },
      { key: 'DisplayMessage', label: 'ข้อความแสดงผล', editable: true, type: 'textarea' }
    ]
  },
  DISEASE_GROUP: {
    inline: true,
    columns: [
      { key: 'Vaccine', label: 'วัคซีน', editable: false },
      { key: 'GROUP', label: 'GROUP', editable: false },
      { key: 'DISEASE_GROUP', label: 'DISEASE_GROUP', editable: false },
      { key: 'AI_ALIAS', label: 'ชื่อเรียกอื่น (AI_ALIAS)', editable: false },
      { key: 'DisplayOrder', label: 'ลำดับ', editable: false },
      { key: 'Status', label: 'สถานะ', editable: true, type: 'select', options: ['ACTIVE', 'INACTIVE'] }
    ]
  },
  VACCINE_NEWS: {
    inline: true,
    creatable: true,
    columns: [
      { key: 'VaccineName', label: 'ชื่อวัคซีน', editable: true, type: 'text' },
      { key: 'StartDate', label: 'วันเริ่ม', editable: true, type: 'text' },
      { key: 'EndDate', label: 'วันสิ้นสุด', editable: true, type: 'text' },
      { key: 'Status', label: 'แสดงผล', editable: true, type: 'checkbox' },
      { key: 'Description', label: 'รายละเอียด', editable: true, type: 'textarea' }
    ],
    formFields: [
      { key: 'VaccineName', label: 'ชื่อวัคซีน', type: 'text', required: true },
      { key: 'StartDate', label: 'วันเริ่ม (YYYY-MM-DD หรือข้อความ เช่น "เร็วๆ นี้")', type: 'text' },
      { key: 'EndDate', label: 'วันสิ้นสุด (YYYY-MM-DD)', type: 'text' },
      { key: 'Status', label: 'แสดงผล', type: 'select', options: ['TRUE', 'FALSE'] },
      { key: 'Description', label: 'รายละเอียด', type: 'textarea' }
    ]
  },
  // Content_Type มี 3 แบบในชีตเดียว (article/infographic/comic-story) — ไม่ branch ฟอร์ม
  // ตามที่ผู้ใช้ระบุ โชว์ทุกคอลัมน์เป็นฟอร์มเดียวเหมือนกันหมดทุกประเภท
  ARTICLES: {
    inline: true,
    creatable: true,
    columns: [
      { key: 'Title', label: 'ชื่อเรื่อง', editable: true, type: 'text' },
      { key: 'Category', label: 'หมวด/ตอน', editable: true, type: 'text' },
      { key: 'Content_Type', label: 'ประเภท', editable: true, type: 'select', options: ['article', 'infographic', 'comic-story'] },
      { key: 'Cover_Image_URL', label: 'ลิงก์รูปปก', editable: true, type: 'text' },
      { key: 'Panel_Images_Folder', label: 'โฟลเดอร์รูปภาพ', editable: true, type: 'text' },
      { key: 'Published', label: 'เผยแพร่', editable: true, type: 'checkbox' },
      { key: 'Body_Content', label: 'เนื้อหา', editable: true, type: 'textarea' }
    ],
    formFields: [
      { key: 'Title', label: 'ชื่อเรื่อง', type: 'text', required: true },
      { key: 'Category', label: 'หมวด/ตอน', type: 'text' },
      { key: 'Content_Type', label: 'ประเภท (article / infographic / comic-story)', type: 'select', options: ['article', 'infographic', 'comic-story'], required: true },
      { key: 'Cover_Image_URL', label: 'ลิงก์รูปปก', type: 'text' },
      { key: 'Panel_Images_Folder', label: 'โฟลเดอร์รูปภาพ', type: 'text' },
      { key: 'Published', label: 'เผยแพร่', type: 'select', options: ['TRUE', 'FALSE'] },
      { key: 'Body_Content', label: 'เนื้อหา', type: 'textarea' }
    ]
  },
  // Active เป็นตัวอักษร "YES"/"NO" ในชีตจริง (ไม่ใช่ boolean) ต้องใช้ select ไม่ใช่
  // checkbox — ClinicStatus.gs.js/MessageBuilder.gs.js เทียบด้วย string equality ตรงๆ
  // closureCreate ใช้ฟอร์มเฉพาะ (openClosureCreateForm) ที่ ClosureType กำหนดว่าจะโชว์
  // PeriodCode หรือไม่ — createFields ด้านล่างคือฟิลด์อิสระที่ไม่ขึ้นกับ ClosureType
  CLOSURES: {
    inline: true,
    creatable: true,
    closureCreate: true,
    columns: [
      { key: 'Start', label: 'เริ่ม (YYYY-MM-DD)', editable: true, type: 'text' },
      { key: 'End', label: 'สิ้นสุด (YYYY-MM-DD)', editable: true, type: 'text' },
      { key: 'Reason', label: 'เหตุผล', editable: true, type: 'text' },
      { key: 'Active', label: 'ใช้งาน', editable: true, type: 'select', options: ['YES', 'NO'] },
      { key: 'Message', label: 'ข้อความแจ้ง', editable: true, type: 'textarea' },
      { key: 'Priority', label: 'ลำดับความสำคัญ', editable: true, type: 'number' },
      { key: 'ClosureType', label: 'ประเภทการปิด', editable: true, type: 'select', options: ['CLOSE_ALL', 'CLOSE_PERIOD'] },
      { key: 'PeriodCode', label: 'ช่วงที่ปิด (ถ้าปิดครึ่งวัน)', editable: true, type: 'select', options: ['ALL', 'WD_AM', 'WD_PM'] }
    ],
    createFields: [
      { key: 'Start', label: 'เริ่ม (YYYY-MM-DD)', type: 'text', required: true },
      { key: 'End', label: 'สิ้นสุด (YYYY-MM-DD)', type: 'text', required: true },
      { key: 'Reason', label: 'เหตุผล', type: 'text' },
      { key: 'Active', label: 'ใช้งาน', type: 'select', options: ['YES', 'NO'] },
      { key: 'Message', label: 'ข้อความแจ้ง', type: 'textarea' },
      { key: 'Priority', label: 'ลำดับความสำคัญ', type: 'text' }
    ]
  },
  PROMOS: {
    inline: false,
    anchorColumn: 'PromoID',
    summaryColumns: ['PromoID', 'PromoName', 'Status', 'StartDate', 'EndDate'],
    formFields: [
      { key: 'PromoID', label: 'รหัสโปรโม (PromoID)', type: 'text', required: true },
      { key: 'PromoName', label: 'ชื่อโปรโมชั่น', type: 'text', required: true },
      { key: 'VaccineGroup', label: 'กลุ่มวัคซีน', type: 'text' },
      { key: 'Discount', label: 'ส่วนลด (บาท)', type: 'number' },
      { key: 'Condition', label: 'เงื่อนไข', type: 'textarea' },
      { key: 'Status', label: 'สถานะ', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
      { key: 'StartDate', label: 'วันเริ่ม (YYYY-MM-DD)', type: 'text' },
      { key: 'EndDate', label: 'วันสิ้นสุด (YYYY-MM-DD)', type: 'text' },
      { key: 'DisplayPeriod', label: 'ช่วงเวลาแสดงผล', type: 'text' }
    ]
  },
  PROMOTIONS: {
    inline: false,
    anchorColumn: 'Title',
    summaryColumns: ['Title', 'Start_Date', 'End_Date', 'Active'],
    formFields: [
      { key: 'Title', label: 'หัวข้อ', type: 'text', required: true },
      { key: 'Description', label: 'รายละเอียด', type: 'textarea' },
      { key: 'Image_URL', label: 'ลิงก์รูปภาพ', type: 'text' },
      { key: 'Start_Date', label: 'วันเริ่ม (YYYY-MM-DD)', type: 'text' },
      { key: 'End_Date', label: 'วันสิ้นสุด (YYYY-MM-DD)', type: 'text' },
      { key: 'Active', label: 'เปิดแสดงผล', type: 'select', options: ['TRUE', 'FALSE'] }
    ]
  }
};

const state = { activeTab: 'VACCINES', activePromoSubTab: 'PROMOS', sheetData: {}, dirtyRows: {} };

function showToast(message, isError) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast ' + (isError ? 'error' : 'success');
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

async function apiGet(url) {
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    return await res.json();
  } catch (err) {
    return { ok: false, error: 'เชื่อมต่อไม่สำเร็จชั่วคราว กรุณาลองใหม่อีกครั้งค่ะ' };
  }
}
async function apiPost(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: 'เชื่อมต่อไม่สำเร็จชั่วคราว กรุณาลองใหม่อีกครั้งค่ะ' };
  }
}

function doLogout() {
  fetch('/admin/logout', { method: 'POST', credentials: 'same-origin' }).then(() => {
    window.location.href = '/admin';
  });
}

function renderTabs() {
  const el = document.getElementById('tabs');
  el.innerHTML = TABS.map(t =>
    '<button class="tab-btn' + (state.activeTab === t.key ? ' active' : '') + '" onclick="switchTab(\\'' + t.key + '\\')">' + t.label + '</button>'
  ).join('');
}

async function switchTab(tabKey) {
  state.activeTab = tabKey;
  renderTabs();
  await renderTabContent();
}

async function loadSheet(sheetKey) {
  if (state.sheetData[sheetKey]) return state.sheetData[sheetKey];
  const data = await apiGet('/api/admin/list?sheet=' + sheetKey);
  state.sheetData[sheetKey] = data;
  return data;
}

async function renderTabContent() {
  const main = document.getElementById('main-content');
  main.innerHTML = '<p class="loading-text">กำลังโหลด...</p>';

  if (state.activeTab === 'PROMOS_GROUP') {
    await renderPromosGroup();
    return;
  }

  const data = await loadSheet(state.activeTab);
  if (!data.ok) {
    main.innerHTML = '<p class="loading-text">โหลดข้อมูลไม่สำเร็จ: ' + (data.error || '') + '</p>';
    return;
  }
  renderInlineTable(state.activeTab, data);
}

function inputForColumn(sheetKey, row, col) {
  const value = row[col.key];
  const name = sheetKey + '__' + row._row + '__' + col.key;
  if (!col.editable) {
    return '<span>' + (value == null ? '' : String(value)) + '</span>';
  }
  if (col.type === 'select') {
    return '<select id="' + name + '" onchange="markDirty(\\'' + sheetKey + '\\', ' + row._row + ')">' + col.options.map(o =>
      '<option value="' + o + '"' + (String(value).trim().toUpperCase() === o.toUpperCase() ? ' selected' : '') + '>' + o + '</option>'
    ).join('') + '</select>';
  }
  if (col.type === 'checkbox') {
    return '<input type="checkbox" id="' + name + '" ' + (value === true ? 'checked' : '') + ' onchange="markDirty(\\'' + sheetKey + '\\', ' + row._row + ')" />';
  }
  if (col.type === 'textarea') {
    return '<textarea id="' + name + '" onchange="markDirty(\\'' + sheetKey + '\\', ' + row._row + ')">' + (value == null ? '' : escapeHtmlClient(String(value))) + '</textarea>';
  }
  return '<input type="' + col.type + '" id="' + name + '" value="' + (value == null ? '' : escapeHtmlClient(String(value))) + '" onchange="markDirty(\\'' + sheetKey + '\\', ' + row._row + ')" />';
}

function escapeHtmlClient(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function markDirty(sheetKey, rowNumber) {
  const key = sheetKey + '__' + rowNumber;
  state.dirtyRows[key] = true;
  const tr = document.getElementById('row-' + key);
  if (tr) tr.classList.add('dirty');
  const btn = document.getElementById('save-' + key);
  if (btn) btn.disabled = false;
}

function renderInlineTable(sheetKey, data) {
  const config = SHEET_UI_CONFIG[sheetKey];
  const main = document.getElementById('main-content');

  let html = '';
  if (config.creatable) {
    const openCall = config.multiDoseCreate ? 'openVaccineCreateForm()' : (config.closureCreate ? 'openClosureCreateForm()' : ('openPromoForm(\\'' + sheetKey + '\\', null)'));
    html += '<button class="btn add-new-btn" style="width:auto" onclick="' + openCall + '">+ เพิ่มรายการใหม่</button>';
  }
  html += '<table><thead><tr>';
  config.columns.forEach(c => { html += '<th>' + c.label + '</th>'; });
  html += '<th></th></tr></thead><tbody>';

  data.rows.forEach(row => {
    const rowKey = sheetKey + '__' + row._row;
    html += '<tr id="row-' + rowKey + '">';
    config.columns.forEach(c => { html += '<td>' + inputForColumn(sheetKey, row, c) + '</td>'; });
    html += '<td><button class="row-save-btn" id="save-' + rowKey + '" disabled onclick=\\'saveInlineRow("' + sheetKey + '", ' + row._row + ', ' + JSON.stringify(row._anchorValue).replace(/'/g, "&#39;") + ')\\'>บันทึก</button></td>';
    html += '</tr>';
  });

  html += '</tbody></table>';
  main.innerHTML = html;
}

async function saveInlineRow(sheetKey, rowNumber, anchorValue) {
  const config = SHEET_UI_CONFIG[sheetKey];
  const fields = {};
  config.columns.forEach(c => {
    if (!c.editable) return;
    const el = document.getElementById(sheetKey + '__' + rowNumber + '__' + c.key);
    if (!el) return;
    if (c.type === 'checkbox') fields[c.key] = el.checked;
    else if (c.type === 'number') fields[c.key] = Number(el.value);
    else fields[c.key] = el.value;
  });

  const result = await apiPost('/api/admin/update', { sheet: sheetKey, row: rowNumber, anchorValue, fields });
  if (result.ok) {
    showToast('บันทึกสำเร็จ');
    delete state.dirtyRows[sheetKey + '__' + rowNumber];
    delete state.sheetData[sheetKey];
    await renderTabContent();
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', true);
  }
}

// ===== PROMOS / PROMOTIONS (sub-tabs + modal form + preview) =====

async function renderPromosGroup() {
  const main = document.getElementById('main-content');
  const sheetKey = state.activePromoSubTab;
  const data = await loadSheet(sheetKey);

  let html = '<div class="sub-tabs">';
  html += '<button class="sub-tab-btn' + (sheetKey === 'PROMOS' ? ' active' : '') + '" onclick="switchPromoSubTab(\\'PROMOS\\')">PROMOS (แชทบอท)</button>';
  html += '<button class="sub-tab-btn' + (sheetKey === 'PROMOTIONS' ? ' active' : '') + '" onclick="switchPromoSubTab(\\'PROMOTIONS\\')">PROMOTIONS (หน้าเว็บ)</button>';
  html += '</div>';

  if (!data.ok) {
    html += '<p class="loading-text">โหลดข้อมูลไม่สำเร็จ: ' + (data.error || '') + '</p>';
    main.innerHTML = html;
    return;
  }

  const config = SHEET_UI_CONFIG[sheetKey];
  html += '<button class="btn add-new-btn" style="width:auto" onclick="openPromoForm(\\'' + sheetKey + '\\', null)">+ เพิ่มรายการใหม่</button>';
  html += '<table><thead><tr>';
  config.summaryColumns.forEach(c => { html += '<th>' + c + '</th>'; });
  html += '<th></th></tr></thead><tbody>';

  data.rows.forEach(row => {
    html += '<tr>';
    config.summaryColumns.forEach(c => { html += '<td>' + (row[c] == null ? '' : String(row[c])) + '</td>'; });
    html += '<td><button class="row-save-btn" onclick=\\'openPromoForm("' + sheetKey + '", ' + JSON.stringify(row).replace(/'/g, "&#39;") + ')\\'>แก้ไข</button></td>';
    html += '</tr>';
  });

  html += '</tbody></table>';
  main.innerHTML = html;
}

async function switchPromoSubTab(sheetKey) {
  state.activePromoSubTab = sheetKey;
  await renderPromosGroup();
}

let currentPromoForm = null; // { sheetKey, isNew, row }

function openPromoForm(sheetKey, row) {
  currentPromoForm = { sheetKey: sheetKey, isNew: !row, row: row };
  const config = SHEET_UI_CONFIG[sheetKey];

  let html = '<div class="modal-overlay" id="promo-modal"><div class="modal-card">';
  html += '<h2>' + (row ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่') + '</h2>';

  config.formFields.forEach(f => {
    const value = row ? (row[f.key] == null ? '' : String(row[f.key])) : '';
    html += '<div class="form-field"><label>' + f.label + (f.required ? ' *' : '') + '</label>';
    if (f.type === 'select') {
      html += '<select id="promo-field-' + f.key + '">' + f.options.map(o =>
        '<option value="' + o + '"' + (value.toUpperCase() === o ? ' selected' : '') + '>' + o + '</option>'
      ).join('') + '</select>';
    } else if (f.type === 'textarea') {
      html += '<textarea id="promo-field-' + f.key + '">' + escapeHtmlClient(value) + '</textarea>';
    } else {
      html += '<input type="text" id="promo-field-' + f.key + '" value="' + escapeHtmlClient(value) + '" />';
    }
    html += '</div>';
  });

  html += '<div id="promo-preview"></div>';
  html += '<div class="modal-actions">';
  html += '<button class="btn btn-secondary" style="width:auto" onclick="closePromoForm()">ยกเลิก</button>';
  html += '<button class="btn btn-secondary" style="width:auto" onclick="previewPromoForm()">ดูตัวอย่าง</button>';
  html += '<button class="btn" style="width:auto" onclick="submitPromoForm()">ยืนยันบันทึก</button>';
  html += '</div></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

function closePromoForm() {
  const el = document.getElementById('promo-modal');
  if (el) el.remove();
  currentPromoForm = null;
}

function collectPromoFormFields() {
  const config = SHEET_UI_CONFIG[currentPromoForm.sheetKey];
  const fields = {};
  config.formFields.forEach(f => {
    const el = document.getElementById('promo-field-' + f.key);
    fields[f.key] = el.value;
  });
  return fields;
}

function previewPromoForm() {
  const fields = collectPromoFormFields();
  const box = document.getElementById('promo-preview');
  box.innerHTML = '<div class="preview-box">' + escapeHtmlClient(JSON.stringify(fields, null, 2)) + '</div>';
}

async function submitPromoForm() {
  const config = SHEET_UI_CONFIG[currentPromoForm.sheetKey];
  const fields = collectPromoFormFields();

  const missingRequired = config.formFields.filter(f => f.required && !String(fields[f.key] || '').trim());
  if (missingRequired.length > 0) {
    showToast('กรุณากรอก: ' + missingRequired.map(f => f.label).join(', '), true);
    return;
  }

  let result;
  if (currentPromoForm.isNew) {
    result = await apiPost('/api/admin/create', { sheet: currentPromoForm.sheetKey, fields });
  } else {
    const row = currentPromoForm.row;
    result = await apiPost('/api/admin/update', {
      sheet: currentPromoForm.sheetKey,
      row: row._row,
      anchorValue: row._anchorValue,
      fields
    });
  }

  if (result.ok) {
    showToast('บันทึกสำเร็จ');
    const savedSheetKey = currentPromoForm.sheetKey;
    closePromoForm();
    delete state.sheetData[savedSheetKey];
    if (savedSheetKey === 'PROMOS' || savedSheetKey === 'PROMOTIONS') {
      await renderPromosGroup();
    } else {
      await renderTabContent();
    }
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', true);
  }
}

// ===== VACCINES (เพิ่มวัคซีนใหม่แบบหลายเข็มในครั้งเดียว) =====
// กรอกข้อมูลร่วม (sharedFields — VaccineID/ชื่อ/ราคา ฯลฯ) ครั้งเดียว แล้วเพิ่มบล็อก
// "เข็มที่" (doseFields — AgeGroup/DoseName/DisplayOrder) ได้กี่เข็มก็ได้ ตอนบันทึกจะยิง
// /api/admin/create ทีละเข็มตามลำดับ (ไม่มี endpoint แบบ batch ฝั่ง Apps Script) ถ้าเข็ม
// ไหนพลาดกลางทางจะหยุดทันทีและบอกว่าสำเร็จไปกี่เข็มแล้ว เพื่อไม่ให้ยิงซ้ำเข็มที่ผ่านไปแล้ว
let vaccineDoseSeq = 0;

function openVaccineCreateForm() {
  vaccineDoseSeq = 0;
  const config = SHEET_UI_CONFIG.VACCINES;

  let html = '<div class="modal-overlay" id="vaccine-modal"><div class="modal-card">';
  html += '<h2>เพิ่มวัคซีนใหม่</h2>';

  config.sharedFields.forEach(f => {
    html += '<div class="form-field"><label>' + f.label + (f.required ? ' *' : '') + '</label>';
    if (f.type === 'select') {
      html += '<select id="vshared-' + f.key + '">' + f.options.map(o => '<option value="' + o + '">' + o + '</option>').join('') + '</select>';
    } else if (f.type === 'textarea') {
      html += '<textarea id="vshared-' + f.key + '"></textarea>';
    } else {
      html += '<input type="text" id="vshared-' + f.key + '" />';
    }
    html += '</div>';
  });

  html += '<div id="vaccine-dose-list"></div>';
  html += '<button type="button" class="add-dose-btn" onclick="addVaccineDoseBlock()">+ เพิ่มเข็ม</button>';
  html += '<div class="modal-actions">';
  html += '<button class="btn btn-secondary" style="width:auto" onclick="closeVaccineCreateForm()">ยกเลิก</button>';
  html += '<button class="btn" style="width:auto" onclick="submitVaccineCreateForm()">บันทึกทั้งหมด</button>';
  html += '</div></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
  addVaccineDoseBlock();
}

function addVaccineDoseBlock() {
  const id = vaccineDoseSeq++;
  const config = SHEET_UI_CONFIG.VACCINES;
  let html = '<div class="dose-block" id="vdose-block-' + id + '">';
  html += '<button type="button" class="dose-remove-btn" onclick="removeVaccineDoseBlock(' + id + ')">ลบเข็มนี้</button>';
  html += '<div class="dose-block-title">เข็มที่เพิ่ม #' + (id + 1) + '</div>';
  config.doseFields.forEach(f => {
    html += '<div class="form-field"><label>' + f.label + (f.required ? ' *' : '') + '</label>';
    html += '<input type="text" id="vdose-' + id + '-' + f.key + '" />';
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('vaccine-dose-list').insertAdjacentHTML('beforeend', html);
}

function removeVaccineDoseBlock(id) {
  const blocks = document.querySelectorAll('#vaccine-dose-list .dose-block');
  if (blocks.length <= 1) {
    showToast('ต้องมีอย่างน้อย 1 เข็ม', true);
    return;
  }
  const el = document.getElementById('vdose-block-' + id);
  if (el) el.remove();
}

function closeVaccineCreateForm() {
  const el = document.getElementById('vaccine-modal');
  if (el) el.remove();
}

async function submitVaccineCreateForm() {
  const config = SHEET_UI_CONFIG.VACCINES;

  const sharedFields = {};
  config.sharedFields.forEach(f => { sharedFields[f.key] = document.getElementById('vshared-' + f.key).value; });

  const missingShared = config.sharedFields.filter(f => f.required && !String(sharedFields[f.key] || '').trim());
  if (missingShared.length > 0) {
    showToast('กรุณากรอก: ' + missingShared.map(f => f.label).join(', '), true);
    return;
  }

  const doseBlocks = Array.from(document.querySelectorAll('#vaccine-dose-list .dose-block'));
  const doses = doseBlocks.map(block => {
    const id = block.id.replace('vdose-block-', '');
    const dose = {};
    config.doseFields.forEach(f => { dose[f.key] = document.getElementById('vdose-' + id + '-' + f.key).value; });
    return dose;
  });

  const missingDose = doses.findIndex(d => config.doseFields.some(f => f.required && !String(d[f.key] || '').trim()));
  if (missingDose !== -1) {
    showToast('กรุณากรอกข้อมูลเข็มที่ ' + (missingDose + 1) + ' ให้ครบ', true);
    return;
  }

  let successCount = 0;
  for (const dose of doses) {
    const fields = Object.assign({}, sharedFields, dose);
    const result = await apiPost('/api/admin/create', { sheet: 'VACCINES', fields });
    if (!result.ok) {
      showToast('สร้างสำเร็จ ' + successCount + ' จาก ' + doses.length + ' เข็ม แล้วหยุดที่เข็มที่ ' + (successCount + 1) + ': ' + (result.error || 'บันทึกไม่สำเร็จ'), true);
      if (successCount > 0) {
        delete state.sheetData.VACCINES;
        await renderTabContent();
      }
      return;
    }
    successCount++;
  }

  showToast('เพิ่มวัคซีนสำเร็จ ' + successCount + ' เข็ม');
  closeVaccineCreateForm();
  delete state.sheetData.VACCINES;
  await renderTabContent();
}

// ===== CLOSURES (ฟอร์มเพิ่มวันปิดใหม่ — ClosureType กำหนดว่าจะโชว์ PeriodCode หรือไม่) =====
// ClosureType/PeriodCode พึ่งพากัน (เลือก CLOSE_PERIOD ก่อนถึงจะเลือก PeriodCode ได้)
// เป็น field dependency แบบแรกในระบบนี้ เลยทำเป็นฟอร์มเฉพาะแยกจาก openPromoForm ทั่วไป
// แทนที่จะเพิ่มความซับซ้อนให้ฟอร์มกลางที่ PROMOS/PROMOTIONS/VACCINE_NEWS/ARTICLES ใช้ร่วมกัน
function openClosureCreateForm() {
  const config = SHEET_UI_CONFIG.CLOSURES;

  let html = '<div class="modal-overlay" id="closure-modal"><div class="modal-card">';
  html += '<h2>เพิ่มวันปิดใหม่</h2>';

  config.createFields.forEach(f => {
    html += '<div class="form-field"><label>' + f.label + (f.required ? ' *' : '') + '</label>';
    if (f.type === 'select') {
      html += '<select id="closure-field-' + f.key + '">' + f.options.map(o => '<option value="' + o + '">' + o + '</option>').join('') + '</select>';
    } else if (f.type === 'textarea') {
      html += '<textarea id="closure-field-' + f.key + '"></textarea>';
    } else {
      html += '<input type="text" id="closure-field-' + f.key + '" />';
    }
    html += '</div>';
  });

  html += '<div class="form-field"><label>ประเภทการปิด (ClosureType) *</label>';
  html += '<select id="closure-field-ClosureType" onchange="onClosureTypeChange()">';
  html += '<option value="CLOSE_ALL">CLOSE_ALL (ปิดเต็มวัน)</option>';
  html += '<option value="CLOSE_PERIOD">CLOSE_PERIOD (ปิดครึ่งวัน)</option>';
  html += '</select></div>';

  html += '<div class="form-field" id="closure-periodcode-wrap" style="display:none">';
  html += '<label>ช่วงที่ปิด (PeriodCode) *</label>';
  html += '<select id="closure-field-PeriodCode">';
  html += '<option value="WD_AM">WD_AM (ปิดเช้า เปิดเย็นตามปกติ)</option>';
  html += '<option value="WD_PM">WD_PM (ปิดเย็น เปิดเช้าตามปกติ)</option>';
  html += '</select></div>';

  html += '<div class="modal-actions">';
  html += '<button class="btn btn-secondary" style="width:auto" onclick="closeClosureCreateForm()">ยกเลิก</button>';
  html += '<button class="btn" style="width:auto" onclick="submitClosureCreateForm()">บันทึก</button>';
  html += '</div></div></div>';

  document.body.insertAdjacentHTML('beforeend', html);
}

function onClosureTypeChange() {
  const type = document.getElementById('closure-field-ClosureType').value;
  document.getElementById('closure-periodcode-wrap').style.display = (type === 'CLOSE_PERIOD') ? 'block' : 'none';
}

function closeClosureCreateForm() {
  const el = document.getElementById('closure-modal');
  if (el) el.remove();
}

async function submitClosureCreateForm() {
  const config = SHEET_UI_CONFIG.CLOSURES;
  const fields = {};
  config.createFields.forEach(f => { fields[f.key] = document.getElementById('closure-field-' + f.key).value; });

  const missing = config.createFields.filter(f => f.required && !String(fields[f.key] || '').trim());
  if (missing.length > 0) {
    showToast('กรุณากรอก: ' + missing.map(f => f.label).join(', '), true);
    return;
  }

  const closureType = document.getElementById('closure-field-ClosureType').value;
  fields.ClosureType = closureType;

  if (closureType === 'CLOSE_PERIOD') {
    fields.PeriodCode = document.getElementById('closure-field-PeriodCode').value;
  } else {
    fields.PeriodCode = 'ALL';
  }

  if (!String(fields.Active || '').trim()) fields.Active = 'YES';

  const result = await apiPost('/api/admin/create', { sheet: 'CLOSURES', fields });
  if (result.ok) {
    showToast('เพิ่มวันปิดสำเร็จ');
    closeClosureCreateForm();
    delete state.sheetData.CLOSURES;
    await renderTabContent();
  } else {
    showToast(result.error || 'บันทึกไม่สำเร็จ', true);
  }
}

renderTabs();
renderTabContent();
`;
