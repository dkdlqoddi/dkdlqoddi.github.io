# CLAUDE.md

This repository is a GitHub Pages user site serving the presentation archive at https://dkdlqoddi.github.io. Pushing to `main` publishes the site. Follow `AGENTS.md` and the append-only decisions in `docs/decisions.md`; the merge gate is PR review.

## Commands

The site is plain static HTML/CSS/JS, with no build step.

- Preview: `python3 -m http.server 8000`.
- Static contracts: `python3 scripts/verify_deck.py`.
- Browser regression: with the server running, install Playwright outside the repo (`npm install --prefix /tmp/presentation-check playwright`), then `NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_theme.cjs`. `CHROME_PATH` defaults to `/usr/bin/google-chrome`; `SITE_URL` and `ARTIFACT_DIR` are configurable.

## Architecture

- `slides.json` is the archive manifest: `title`, `date` (`YYYY-MM-DD`), `description`, `dir`. `main.js` renders an ordinary list in newest-first order and skips invalid entries. Published slugs are stable URLs.
- `assets/theme.css` and `assets/template.js` provide the shared light theme and header. The visual reference is `slides/agent-tools-antigravity/`: white paper, forest green, lime, peach and lavender, Pretendard, rounded panels, gentle movement.
- `index.html`, `styles.css`, `main.js` implement the archive. `scripts/galaxy.js` controls the decorative CSS Galaxy, separately from card links. Do not reintroduce global wheel/touch interception or a continuous WebGL loop.
- `slides/shared/deck-base.css` is the presentation component library. `deck-template.js` owns the header/footer, contents, reading/presentation mode, Reveal initialization, progress, notes, keyboard handling, fullscreen and printing. Deck-specific JS only implements content interactions.
- `slides/shared/legacy-deck.css` adapts existing 960×700 decks. The latest course uses 1280×720. Keep legacy content geometry and fragments rather than resizing every diagram to the new aspect ratio.
- CSS order: Reveal `white.css`, `assets/theme.css`, `deck-base.css`, optional `legacy-deck.css`, then deck-specific styles. JS order: Reveal, `assets/template.js`, `deck-template.js`, then exercises. Do not separately call `Reveal.initialize()` in a deck.
- Every deck starts with `body.reading` for no-JS fallback and uses `main#course.reveal > .slides > section`. Optional section `id`, `data-title`, and `data-chapter` customize stable links and contents; defaults are generated. Old numeric hashes still resolve.
- `slides/sample/` is the copy-me template and authoring guide. Keep it out of `slides.json`.
- `slides/shared/code-copy.css` and `code-copy.js` add code copy buttons. The course's exercise copy button additionally supports selecting text when opened with `file://`.
- `404.html` uses root asset paths for deep missing URLs, with minimal inline fallback styles. The downloadable `practice-result.html` must remain readable as a standalone HTML file.

## Authoring and verification

Use the light color-scheme metadata and shared tokens (`--ink`, `--forest`, `--muted`, `--line`, `--paper`, `--green`, `--lime`, `--peach`, `--lavender`, `--danger`). Avoid fixed white diagram text or dark backgrounds. Keep SVG `role="img"` and an accessible label; purely decorative elements are hidden from assistive technology. Preserve Korean word boundaries and intentional line breaks.

The shared template provides motion reduction, mobile reading, notes, dialog focus and print handling. Reveal's structure CSS must have `media="screen"` so its print rules do not override the common layout. Printing displays final fragment states, outputs one slide per page and restores the DOM/state afterward. Test HTTP and direct `file://` decks, mobile widths, contents, fragments, existing exercises and PDFs after shared changes. New reversible implementation decisions are logged at decision time.

## Hard constraints

- Keep `.nojekyll`; otherwise Jekyll may interpret Reveal's `{{ }}` content.
- Keep submodules public and referenced via HTTPS.
- Reveal 6.0.1 is vendored; no plugins are installed. Notes are handled by the shared shell, not a Reveal plugin.
- All fonts/scripts/styles are local. Keep relative asset paths in decks for offline use. Never modify/subset the embedded Pretendard data or remove its license.
- Do not add `maximum-scale` or `user-scalable=no`.
- `vendor/three.js/` and `vendor/montserrat/` remain archived dependencies and are not loaded by the current template.
- Files over 100 MiB cannot be pushed; host videos elsewhere.
- GitHub Pages may cache assets for up to ten minutes. Manifest fetch uses `cache: 'no-cache'`.
