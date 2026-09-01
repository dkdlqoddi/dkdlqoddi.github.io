# '나만의 돌쇠 AI 만들기' No-Scroll v2 및 UI/UX 템플릿 고도화 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 전 슬라이드 높이 예산 및 템플릿 UI 최적화 내역

1. **글로벌 CSS 튜닝**:
   - `h2`: `1.50em`, `h3`: `1.15em`, `p.eyebrow`: `0.45em`, `p.small`: `0.47em`
   - `pre`: `font-size: 0.46em; line-height: 1.22; padding: 0.45em 0.7em;`
   - `.panel-card`: `padding: 6px 10px; margin-bottom: 5px; h4 { font-size: 0.60em; } p { font-size: 0.46em; line-height: 1.30; }`
   - `.tool-tags`, `.tag`, `.summary-box` 템플릿 스타일 추가.
2. **슬라이드별 최적화 (20개 전수)**:
   - **Slide 1 (표지)**: 타이틀과 부제, 플로우 배지 마진 컴팩트화.
   - **Slide 2 (비유)**: 좌 4개, 우 3개 패널 카드 패딩 및 폰트 슬림화 (총 높이 ~380px).
   - **Slide 3 (레이아웃)**: 8줄 컴팩트 파일 트리 + 4개 설명 패널 카드.
   - **Slide 4 (JedAI)**: SKILL.md 프론트매터 압축(9줄) + 3개 카드 + 미니 SVG.
   - **Slide 5 (Siemens)**: SKILL.md 프론트매터 압축(9줄) + 3개 카드 + 미니 SVG.
   - **Slide 6 (SNPS)**: SKILL.md 프론트매터 압축(9줄) + 3개 카드 + 미니 SVG.
   - **Slide 7 (Harness)**: 2x2 그리드 카드 + 1줄 permission 코드 + 요약.
   - **Slide 8 (Agent)**: dolsoe.md 프론트매터 및 지시문 압축(10줄) + 2개 카드.
   - **Slide 9 (Flow & Loop)**: 단방향 SVG 다이어그램 + 루프 코드 블록 + 안내 카드.
   - **Slide 10 (Loop 실행)**: CLI 프롬프트 호출 코드(10줄) + 3개 원칙 카드.
   - **Slide 11 (Loop 지시문)**: 세션 지시문(10줄) + 3개 카드.
   - **Slide 12 (마름)**: maleum.md(9줄) + 2개 서브에이전트 카드 + 미니 SVG.
   - **Slide 13 (언년이)**: eonnyeon.md(9줄) + 2개 판정 카드.
   - **Slide 14 (Graph SVG)**: 상태 전이 SVG 다이어그램 viewBox 및 높이 완벽 수용.
   - **Slide 15 (Checklist)**: 좌 3개, 우 2개 5단계 체크리스트 카드.
   - **Slide 16 (방법론 지도)**: 좌 4개, 우 3개 7대 방법론 패널.
   - **Slide 17 (마을 게시판)**: agent-card.json(8줄) + 3개 카드.
   - **Slide 18 (Spec-Driven)**: specs/ & AGENTS.md(9줄) + 3개 카드.
   - **Slide 19 (돌쇠의 도서관)**: library/ 트리(7줄) + 3개 지식화 카드.
   - **Slide 20 (Beyond)**: 좌 3개, 우 2개 확장 기법 카드 + 템플릿 네비게이션 링크.
