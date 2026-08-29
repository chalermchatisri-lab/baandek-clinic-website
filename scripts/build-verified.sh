#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v timeout >/dev/null || {
  echo "build-verified.sh requires GNU timeout." >&2
  exit 69
}

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

echo "Running bounded vinext build..."
timeout \
  --signal=TERM \
  --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${vinext}" build

# vinext 0.0.50 ฝัง path ฟอนต์ของเครื่องที่ build ลงใน dist/server/index.js เมื่อ build
# บน Windows (บั๊กเฉพาะ OS นี้ — ดูรายละเอียดต้นเหตุใน fix-vinext-font-urls.mjs)
# ต้องแปลงกลับเป็น URL จริงก่อน deploy ไม่งั้นผู้เข้าชมโหลดฟอนต์ไม่ได้ทั้งเว็บ
node "${script_dir}/fix-vinext-font-urls.mjs" "${SITES_PROJECT_ROOT}"

"${script_dir}/validate-artifact.sh"
