# CLAUDE.md

This repository is a GitHub Pages user site serving the presentation archive at https://dkdlqoddi.github.io. Pushing to `main` publishes the site. Follow `AGENTS.md` and the append-only decisions in `docs/decisions.md`; the merge gate is PR review.

## Commands

The site is plain static HTML/CSS/JS, with no build step.

- Preview: `python3 -m http.server 8000`.
- Chalk lifecycle and shared-link regression: `NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_chalk.cjs`.
- Static contracts: `python3 scripts/verify_deck.py`.
- Lab outcomes and MCP/API boundaries: `python3 scripts/verify_course_labs.py`.
- Regenerate the no-JS course lists: `python3 scripts/build_course_catalog.py`.
- Course/legacy-link browser regression: `NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_curriculum.cjs`.
- All 10 downloadable PDFs: `NODE_PATH=/tmp/presentation-check/node_modules node scripts/export_pdfs.cjs`. Optional arguments limit the deck slugs.
- Browser regression: with the server running, install Playwright outside the repo (`npm install --prefix /tmp/presentation-check playwright`), then `NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_theme.cjs`. `CHROME_PATH` defaults to `/usr/bin/google-chrome`; `SITE_URL` and `ARTIFACT_DIR` are configurable.
- Video: with the server running, `NODE_PATH=/tmp/presentation-check/node_modules node scripts/render_video.cjs` renders `video/agent-tools-antigravity/` (deterministic WAAPI timeline, local ffmpeg, `scripts/video_audio.py` soundtrack) to the git-ignored `video/out/`. Never commit the MP4.

## Architecture

- `slides.json` defines 10 modules / 122 slides: novice N1–N4 (52), expert E0–E5 (70 including both elective paths). Metadata includes `title`, `date`, `updated`, `description`, `dir`, `stage`, `audience`, `track`, `module`, `path`, `prerequisites`, `next`, `pdf`, `slideCount`. `prerequisites` is human-readable text; `next` is an array of deck slugs. E0–E2 are common; E3 SW / E4 EDA are alternatives; E5 is optional operations.
- `main.js` enhances the two static course lists in manifest order. `scripts/build_course_catalog.py` regenerates those lists inside the course markers in `index.html`. Preserve static cards on failed or empty fetch. Published slugs and existing PDF filenames are stable.
- `assets/theme.css` and `assets/template.js` provide the base tokens and header. Presentations and the archive opt into `assets/chalk-theme.css`: dark green board, colored chalk, local Pretendard headings and body text. `assets/chalk-motion.js` owns finite writing/replay/pause/finish. Opt components into nested reveals with `data-chalk-group`; use `data-chalk="fade"` for icons and illustrations. Keep Reveal fragments and auto-animate diagrams outside this animation. Resume and existing video retain their original theme.
- `index.html`, `styles.css`, `main.js` implement the archive. The archive retains the decorative orbital illustration; chalk-motion.js animates its text, card details, icons and decorative components without continuous rotation. Do not reintroduce global wheel/touch interception or a continuous WebGL loop.
- `slides/shared/deck-base.css` is the presentation component library. `deck-template.js` owns the header/footer, contents, reading/presentation mode, Reveal initialization, progress, notes, keyboard handling, fullscreen and printing. Deck-specific JS only implements content interactions.
- `slides/shared/lesson-layout.css` provides reusable complete diagrams, cards, tables and code panels for the 1280×720 courses. `legacy-deck.css` still supports the 960×700 authoring sample. Keep its fragment/morph examples intact.
- CSS order: Reveal `white.css`, `assets/theme.css`, `deck-base.css`, optional `legacy-deck.css`, then deck-specific styles, cartoon/jelly layouts then chalk-theme.css and optional lesson-layout.css (layout only). JS order: Reveal, `assets/template.js`, `deck-template.js`, then exercises and chalk-motion.js. Do not separately call `Reveal.initialize()` in a deck.
- Every deck starts with `body.reading` for no-JS fallback and uses `main#course.reveal > .slides > section`. Optional section `id`, `data-title`, and `data-chapter` customize stable links and contents; defaults are generated. Old numeric hashes resolve through `body[data-previous-order]`; removed IDs use section `data-previous-ids`. Map both to current semantic IDs and test initial navigation and same-document hash changes.
- `slides/sample/` is the 8-slide copy-me template and authoring guide. Keep it out of `slides.json`.
- `slides/shared/labs/` contains Python stdlib mock HTTP/Agent/MCP labs, fictional fixtures, Skill example and portable ZIP. Basic exercises make no external model calls. `opencode_client.py` is an opt-in real connector and must be identified as such. Validate failures, version/evidence mismatches and bounded execution, not just successful output.
- The existing video is pinned to its original 22 scenes in `video/agent-tools-antigravity/source-slides.json`; current N3 has 14 slides. Do not derive the old video scene count from the revised deck.
- `slides/shared/code-copy.css` and `code-copy.js` add code copy buttons. The course's exercise copy button additionally supports selecting text when opened with `file://`.
- `404.html` uses root asset paths for deep missing URLs, with minimal inline fallback styles. The downloadable `practice-result.html` must remain readable as a standalone HTML file.

## Authoring and verification

Use dark color-scheme metadata on chalk-theme pages, light on the other pages, and shared tokens (`--ink`, `--forest`, `--muted`, `--line`, `--paper`, `--green`, `--lime`, `--peach`, `--lavender`, `--danger`). Use token colors for diagram text and surfaces; check contrast on the actual background. Keep SVG `role="img"` and an accessible label; purely decorative elements are hidden from assistive technology. Preserve Korean word boundaries and intentional line breaks.

The shared template provides motion reduction, mobile reading, notes, dialog focus and print handling. Reveal's structure CSS must have `media="screen"` so its print rules do not override the common layout. Printing displays final fragment states, outputs one slide per page and restores the DOM/state afterward. Test HTTP and direct `file://` decks, mobile widths, contents, fragments, existing exercises and PDFs after shared changes. New reversible implementation decisions are logged at decision time.

## Hard constraints

- Keep `.nojekyll`; otherwise Jekyll may interpret Reveal's `{{ }}` content.
- Keep submodules public and referenced via HTTPS.
- Reveal 6.0.1 is vendored; no plugins are installed. Notes are handled by the shared shell, not a Reveal plugin.
- All fonts/scripts/styles are local. Keep relative asset paths in decks for offline use. Never modify/subset the embedded Pretendard data or remove its license. Headings and body text share the existing local Pretendard font.
- Do not add `maximum-scale` or `user-scalable=no`.
- `vendor/three.js/` and `vendor/montserrat/` remain archived dependencies and are not loaded by the current template.
- Files over 100 MiB cannot be pushed; host videos elsewhere.
- GitHub Pages may cache assets for up to ten minutes. Manifest fetch uses `cache: 'no-cache'`.
