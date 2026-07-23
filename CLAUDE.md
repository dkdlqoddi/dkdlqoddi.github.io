# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository purpose

This is `dkdlqoddi.github.io` — a **GitHub Pages user site** serving a presentation hub: a landing page ("발표 기록") that routes to reveal.js decks under `slides/`. Served from `main` at https://dkdlqoddi.github.io.

Practical implication: pushing to `main` publishes the live site. There is no separate deploy step — the branch *is* the deployment. Work on a feature branch; merge to `main` only after the blindspot pre-merge quiz is passed (see MANDATE below).

## Commands

No build, lint, or test tooling — plain static HTML/CSS/JS.

- Local preview: `python3 -m http.server 8000` → http://localhost:8000
- Sanity checks before merge: `python3 -m json.tool slides.json`; every `dir` in slides.json must have a matching `slides/<dir>/index.html`.

## Architecture

- `slides.json` — single manifest driving the landing card grid. Entry schema: `{"title", "date": "YYYY-MM-DD", "description", "dir"}`. `main.js` skips invalid entries with a console warning instead of failing the whole list.
- `index.html` / `styles.css` / `main.js` — landing page (white-space HUD theme, monochrome, Korean UI). The landing never loads reveal.js; it links to decks by URL only.
- `slides/<slug>/` — one self-contained reveal.js deck per talk. Slug = lowercase letters + hyphens (it becomes the shared public URL — a published contract). New decks: copy `slides/sample/` (it doubles as the how-to guide), edit, register in slides.json.
- `vendor/reveal.js/` — reveal.js **6.0.1 pinned**, only `white`/`black` themes vendored (they embed fonts, so decks work fully offline) + upstream LICENSE. Decks reference it via **relative** paths (`../../vendor/…`) — keep relative so decks open via file:// without internet.
- `docs/blindspot/` — internal process docs (requirements/unknowns/explainer/reports/quizzes). Not site content, but publicly fetchable by URL (accepted trade-off; repo is public anyway).

## Hard constraints

- **Never delete `.nojekyll`.** Without it Jekyll runs on deploy and its Liquid parsing (`{{ }}`) breaks reveal.js assets — deploys fail or content gets mangled.
- **`.claude/shared` submodule must stay a public repo with an HTTPS URL.** Private or SSH breaks the entire Pages deployment at checkout.
- Files >100MiB cannot be pushed; host talk videos externally.
- Visitor-facing list updates can lag up to 10 minutes (Pages serves `Cache-Control: max-age=600`; `main.js` fetches the manifest with `cache: "no-cache"` to soften this).

@.claude/shared/MANDATE.md
