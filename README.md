# LATYS — Landing page

Static site for **latys.app**. No build step — plain HTML/CSS/JS.

## Files
- `index.html` — landing page (hero, features, BYO-AI, community, $5 pricing).
- `privacy.html` / `terms.html` — legal pages linked from the footer.
- `icon.png` — favicon + share image (regenerate with `npm run icons`).
- `latys-latest.json` — the update feed the app polls (`UPDATE_FEED_URL` in
  `shared/constants/index.ts` points at `https://latys.app/latys-latest.json`).

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
