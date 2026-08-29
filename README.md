# BAANDEK Clinic — Deploy Workflow

## Preview → verify → promote (always in this order)

This project has two Cloudflare Workers: **`baandek-clinic-preview`** (staging) and
**`baandek-clinic`** (production, serves the real Landing Page + Admin Panel). Always
deploy to preview first, check it in a browser, and only then deploy to production.

```bash
# 1. Deploy to PREVIEW — verify at https://baandek-clinic-preview.<account>.workers.dev
CLOUDFLARE_ENV=preview npm run build && npx wrangler deploy

# 2. Once verified, deploy to PRODUCTION — https://baandek-clinic.<account>.workers.dev
npm run build && npx wrangler deploy
```

### Why `CLOUDFLARE_ENV=preview` and not `wrangler deploy --env preview`

`@cloudflare/vite-plugin` (used internally by `vinext build`) decides which
`wrangler.jsonc` environment to bake into the build **at build time**, by reading the
`CLOUDFLARE_ENV` variable — not at deploy time. The build writes a fully-resolved
"redirected" config to `dist/server/wrangler.json`, and Wrangler explicitly refuses to
apply `--env` on top of an already-redirected config. So:

- `wrangler deploy --env preview` **without** `CLOUDFLARE_ENV=preview` set during the
  preceding build silently deploys to production anyway — the flag is ignored. This bit
  us once already (2026-08-04): several Admin Panel deploys intended for preview landed
  directly on production. No harm came of it that time only because testing was unusually
  careful, but don't rely on that.
- Setting `CLOUDFLARE_ENV=preview` before `npm run build` is what actually makes
  `dist/server/wrangler.json` resolve to the `env.preview` block in `wrangler.jsonc`
  (`name: "baandek-clinic-preview"`). After that, a plain `wrangler deploy` (no `--env`
  needed — it's already baked in) correctly lands on the separate preview Worker.

**Quick sanity check before trusting a "preview" deploy**: after building, inspect
`dist/server/wrangler.json` and confirm `"name"` says `baandek-clinic-preview`, not
`baandek-clinic`, before running `wrangler deploy`.

## Secrets

Both Workers need their own copies of: `ADMIN_PASSWORD`, `SESSION_SECRET`,
`ADMIN_API_TOKEN` (Admin Panel auth — see `worker/admin/`). Set them explicitly per
target:

```bash
printf '%s' "value" | npx wrangler secret put SECRET_NAME --env preview
printf '%s' "value" | npx wrangler secret put SECRET_NAME
```

**Always use `printf '%s'`, never bare `echo`**, when piping a secret value in — `echo`
appends a trailing newline that becomes part of the stored secret and silently breaks
exact-match comparisons (e.g. the Admin Panel login password check). This caused a real,
confusing "correct password rejected" bug during initial setup.

## Static files in `public/` that must be served byte-exact (e.g. Google site-verification)

`wrangler.jsonc`'s `assets.html_handling` is explicitly set to `"none"`. The Cloudflare
default (`"auto-trailing-slash"`) strips `.html` from the URL and 307-redirects to the
extensionless path — fine for pretty URLs, but it silently breaks anything that must be
served at its exact literal path with a direct 200, like Google Search Console's
`/google<id>.html` verification file (added 2026-08-05, must stay in `public/` forever —
removing it revokes the site's verified-ownership status in Search Console). Don't remove
or "clean up" `html_handling: "none"` without checking whether anything like this still
depends on it. No other page on this site needs the default pretty-URL behavior (the rest
is Next.js SSR, not static `.html`), so this is safe to leave set site-wide.
