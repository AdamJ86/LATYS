# LATYS — Landing page

Static site for **latys.app**. No build step — plain HTML/CSS/JS.

## Files
- `index.html` — landing page: hero, the film, features, bring-your-own-AI,
  get started (agent install commands), the narrated tour, community, pricing.
- `privacy.html` / `terms.html` — legal pages linked from the footer.
- `remote.html` — the phone remote (`latys.app/remote`).
- `icon.png` — favicon (the app icon).
- `media/` — trailer, hero backdrop, feature loops, narrated tour chapters
  (+ captions), icons and the share image. Regenerate from the app repo:
  `python scripts/landing/clean_icon.py`, `node scripts/landing/community-clip.mjs`
  (with the demo app served), `python scripts/landing/trailer.py .artifacts/landing/out/trailer.mp4 --poster .artifacts/landing/out/trailer-poster.jpg`
  then `python scripts/landing/media.py landing`.
- `latys-latest.json` — the update feed the app polls (`UPDATE_FEED_URL` in
  `shared/constants/index.ts` points at `https://latys.app/latys-latest.json`).
  The page also reads it to show the current version on the download buttons.

## Deploy
Drop this folder on any static host (Netlify, Vercel, Cloudflare Pages, GitHub
Pages, S3). Point the `latys.app` domain at it.

Then upload the installer so the download button resolves:
```
/downloads/LATYS-0.1.0-setup.exe   ← from release/ after `npm run package:win`
```

## Before publishing
- [ ] Replace `[YOUR NAME / COMPANY]` and `[YOUR JURISDICTION]` in
      `privacy.html` + `terms.html` (and the source `legal/*.md`).
- [ ] Upload the signed (or unsigned) installer to `/downloads/`.
- [ ] Bump `version` + `url` in `latys-latest.json` on each release to light up
      the in-app update banner.

<!-- pages redeploy 0.1.28 @ 2026-07-03T21:24:52Z -->
