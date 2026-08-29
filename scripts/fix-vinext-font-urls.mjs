/**
 * แก้บั๊กของ vinext 0.0.50 ที่ทำให้ @font-face ใน build ชี้ไป path ในเครื่องที่ build
 * (เช่น C:/Users/.../.vinext/fonts/geist-xxxx/geist-yyyy.woff2) แทน URL จริงบนเว็บ
 * ผลคือผู้เข้าชมโหลดฟอนต์ไม่ได้เลย ตกไปใช้ฟอนต์ระบบแทนทั้งเว็บ
 *
 * ต้นเหตุ (node_modules/vinext/dist/plugins/fonts.js):
 *   - fetchAndCacheFont() เขียน CSS ที่ cache ไว้โดยแปลง path เป็น forward slash เสมอ
 *     (`css.split(fontUrl).join(filePath.replaceAll("\\", "/"))`)
 *   - _rewriteCachedFontCssToServedUrls() ซึ่งมีหน้าที่แปลง path เครื่อง -> URL จริง
 *     กลับเช็คด้วย `css.includes(cacheDir)` โดยที่ cacheDir มาจาก path.join() ตรงๆ
 *     ซึ่งบน Windows เป็น backslash -> เงื่อนไขไม่ match -> return CSS เดิมแบบเงียบๆ
 *
 * เป็นบั๊กเฉพาะ Windows (บน macOS/Linux ทั้งสองฝั่งเป็น forward slash เลยตรงกันพอดี)
 * เลยแก้ที่ build ของโปรเจกต์เราเองแทนการแก้ใน node_modules (ซึ่งจะหายทุกครั้งที่
 * npm install ใหม่) — ถ้าวันหนึ่ง vinext แก้บั๊กนี้แล้ว สคริปต์นี้จะไม่เจออะไรให้แทนที่
 * และจบแบบ no-op เอง (ไม่ error) ปลอดภัยที่จะปล่อยไว้
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.argv[2] || process.cwd();
const serverBundle = join(projectRoot, "dist", "server", "index.js");
const clientDir = join(projectRoot, "dist", "client");

if (!existsSync(serverBundle)) {
  console.error(`[fix-vinext-font-urls] ไม่พบ ${serverBundle} — ต้องรัน vinext build ก่อน`);
  process.exit(66);
}

// หาว่าไฟล์ฟอนต์ถูก copy ไปไว้ที่ไหนจริงๆ ใน dist/client แล้วสร้าง URL prefix จากตรงนั้น
// (ไม่ hardcode "assets" เผื่อ build.assetsDir ถูกเปลี่ยนภายหลัง — vinext เองก็อิง
// ค่านี้เหมือนกัน ถ้าสองฝั่งไม่ตรงกันจะกลายเป็น 404 ทุกไฟล์)
const FONT_NAMESPACE = "_vinext_fonts";
let servedPrefix = null;

if (existsSync(clientDir)) {
  for (const entry of readdirSync(clientDir, { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(join(clientDir, entry.name, FONT_NAMESPACE))) {
      servedPrefix = `/${entry.name}/${FONT_NAMESPACE}`;
      break;
    }
  }
  if (!servedPrefix && existsSync(join(clientDir, FONT_NAMESPACE))) {
    servedPrefix = `/${FONT_NAMESPACE}`;
  }
}

const bundle = readFileSync(serverBundle, "utf8");

// จับ path เครื่องทั้งแบบ Windows (C:/...) และ POSIX (/home/...) ที่ลงท้ายด้วย /.vinext/fonts
const localFontPathPattern = /(?:[A-Za-z]:)?\/(?:[^"'`)\s]*?\/)?\.vinext\/fonts/g;
const matchCount = (bundle.match(localFontPathPattern) || []).length;

if (matchCount === 0) {
  console.log("[fix-vinext-font-urls] ไม่พบ path ฟอนต์แบบ local ใน dist/server/index.js — ไม่ต้องแก้");
  process.exit(0);
}

if (!servedPrefix) {
  console.error(
    `[fix-vinext-font-urls] พบ path ฟอนต์แบบ local ${matchCount} จุด แต่หาโฟลเดอร์ ` +
      `${FONT_NAMESPACE} ใน dist/client ไม่เจอ — แปลว่าไฟล์ฟอนต์ไม่ได้ถูก copy ออกมา ` +
      `ถ้าแทนที่ path ตอนนี้จะกลายเป็น 404 ทุกไฟล์ จึงหยุดไว้ก่อน`
  );
  process.exit(66);
}

const fixed = bundle.replace(localFontPathPattern, servedPrefix);
const remaining = (fixed.match(localFontPathPattern) || []).length;

if (remaining > 0) {
  console.error(`[fix-vinext-font-urls] แทนที่ไม่ครบ ยังเหลือ ${remaining} จุด`);
  process.exit(70);
}

writeFileSync(serverBundle, fixed);
console.log(
  `[fix-vinext-font-urls] แก้ path ฟอนต์ ${matchCount} จุด -> ${servedPrefix} ใน dist/server/index.js`
);
