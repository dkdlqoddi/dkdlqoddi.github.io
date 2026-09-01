# '나만의 돌쇠 AI 만들기' 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 기준: reveal.js 6.0.1 + Pretendard/Montserrat + deck-base.css v2
- 날짜: 2026-09-01

## 1. 구현 원칙
- **템플릿 준수**: `slides/sample/index.html`의 다크 스페이스 HUD 구조, `<canvas id="galaxy-3d-bg">`, `deck-base.css?v=2`, `code-copy.css/js`, Three.js + Galaxy3D 배경 구조를 완벽히 계승.
- **코드 블록**: `<pre><code class="markdown">...</code></pre>`, `<pre><code class="bash">...</code></pre>`, `<pre><code class="json">...</code></pre>` 적용 및 복사 버튼 자동 활성화.
- **20개 슬라이드 완결 구성**:
  1. 표지 (PART 1~7 종합 가이드)
  2. 비유 체계 카드 그리드 (Skill, Agent, Orchestrator, Harness, Flow, Loop, Graph)
  3. 디렉터리 레이아웃 구조도 (`my-dolsoe/` 트리) + 4대 규칙
  4. 1단계: 물 긷는 Skill (`draw-water/SKILL.md` + 미니 그래프)
  5. 1단계: 장작 패는 Skill (`chop-wood/SKILL.md` + 미니 그래프)
  6. 1단계: 밥 짓는 Skill (`cook-meal/SKILL.md` + 미니 그래프)
  7. Harness Engineering: 마당 짓기 4대 축 (컨텍스트, 도구, 권한, 오프라인)
  8. 2단계: Agent 만들기 (`dolsoe.md` + 시각별 분기 흐름도)
  9. Flow vs Loop: 한 줄기와 되풀이 비교
  10. Loop 실행 스크립트 (`scripts/draw.sh` + 핵심 해설)
  11. Loop 실행 프롬프트 (`@dolsoe` 프롬프트 + 원칙)
  12. 3단계: 마름 Orchestrator (`maleum.md` + 2단 에이전트 위임)
  13. 4단계: 언년이 Evaluator (`eonnyeon.md` + PASS/FAIL 피드백)
  14. Graph Engineering 전체 지도 (SVG 기반 전체 종합 상태 전이 그래프)
  15. Local Checklist (5단계 즉시 실행 가이드)
  16. AI Tool 방법론 지도 (7대 확장 영역 그리드)
  17. 5단계: 돌쇠들의 마을 게시판 (`agent-card.json` + A2A Blackboard)
  18. 6단계: Spec-Driven Development (`AGENTS.md`, `specs/`, `docs/adr/`)
  19. 7단계: 돌쇠의 도서관 (`library/` RAG vs LLM Wiki)
  20. Beyond the Graph (5대 미래 확장 기법 및 출처)
- **접근성 & 표준화**:
  - 모든 SVG에 `role="img"`, `aria-label`, `<p class="visually-hidden">` 구비
  - `currentColor` 기반 단색/위계 색상 (`--primary`, `--secondary`, `--accent`, `--dim`, `--hairline`)
  - `@media print` 및 `prefers-reduced-motion` 안전 대응
