css = """
.card.in { opacity: 1; }

.card:hover, .card:focus-visible, .card.hover-active {
  color: var(--primary);
  background: rgba(20, 30, 50, 0.85);
  border-color: rgba(0, 255, 255, 0.8);
  border-left: 5px solid rgba(0, 255, 255, 1);
  box-shadow: 0 8px 30px rgba(0, 255, 255, 0.2);
  transform: translateX(-10px);
  outline: none;
}
.card:has(a:focus-visible) {
  outline: 2px solid var(--bright);
  outline-offset: 3px;
  border-color: var(--bright);
}

.card-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.card-date {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  opacity: 0.6;
  margin-bottom: 0.6rem;
}
.card-title {
  display: block;
  font-size: 1.0rem;
  font-weight: 500;
  color: var(--primary);
  line-height: 1.2;
  margin-bottom: 0.4rem;
}
/* 카드 전체 클릭 (block link) */
.card-title a { color: inherit; text-decoration: none; outline: none; }
.card-title a::after { content: ""; position: absolute; inset: 0; border-radius: 10px; }

.card-desc {
  display: block;
  font-size: 0.75rem;
  line-height: 1.4;
  word-break: keep-all;
}
.card-open {
  align-self: flex-end;
  transition: translate 0.18s ease;
}
.card:hover .card-open { translate: 4px 0; }

.status { padding: 32px 0; }

/* ── 푸터 ──────────────────────────────────────────────── */
.site-foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 0 clamp(28px, 8vw, 120px) calc(var(--hud-inset) + 26px);
}

.foot-sep { color: var(--hairline); }

/* ── 반응형 ────────────────────────────────────────────── */
@media (max-width: 640px) {
  :root { --hud-inset: 10px; }
  .hero { min-height: 76vh; }
  .hud-bl { display: none; }
}

/* ── 인쇄: 어두운 화면을 흰 종이용으로 되돌림 ────────── */
@media print {
  html, body { background: #fff; }
  body, .title, .card-title, .tagline, .card-desc, .mono, .foot-sep { color: #000; }
  .galaxy-bg, .hud, .scroll-cue { display: none; }
  .card { opacity: 1; translate: 0 0; border-color: #000; }
  .log-rule { border-top-color: #000; }
}

/* ── 움직임 줄이기 옵션 ──────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  #galaxy-3d-bg { display: none !important; }
  .card { opacity: 1; translate: 0 0; }
}
"""

with open("styles.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = lines[:228]
with open("styles.css", "w", encoding="utf-8") as fw:
    fw.writelines(new_lines)
    fw.write(css)
