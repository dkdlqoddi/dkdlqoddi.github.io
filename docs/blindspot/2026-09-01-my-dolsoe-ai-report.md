# '나만의 돌쇠 AI 만들기' 웹 발표자료 제작 작업 보고서

- 날짜: 2026-09-01
- 대상: `slides/my-dolsoe-ai/index.html`, `slides.json`
- 퀴즈: `docs/blindspot/quiz/2026-09-01-my-dolsoe-ai.html` — 통과 확인 필수

## Human 섹션

### 요약
`C:\Users\dkdlq\Documents\나만의 돌쇠 AI 만들기.pptx`의 20개 슬라이드 전체 내용을 저장소의 표준 인터랙티브 reveal.js 6.0.1 덱으로 변환하여 신설했습니다.
- **슬라이드 디렉터리**: `slides/my-dolsoe-ai/` (URL: `https://dkdlqoddi.github.io/slides/my-dolsoe-ai/`)
- **디자인 및 테마**: 템플릿(`slides/sample/`)과 동일한 다크 스페이스 HUD 테마, 3D 별빛 은하 배경, Montserrat + Pretendard 글꼴, `<pre><code>` 복사 버튼 탑재.
- **20개 슬라이드 완결 구성**:
  1. 표지 (Harness → Graph Engineering, 돌쇠 AI)
  2. 비유 체계 (Skill, Agent, Orchestrator, Harness, Flow, Loop, Graph)
  3. 디렉터리 구조 (`my-dolsoe/` 트리 및 4대 규칙)
  4. 1단계: 물 긷는 Skill (`draw-water/SKILL.md`)
  5. 1단계: 장작 패는 Skill (`chop-wood/SKILL.md`)
  6. 1단계: 밥 짓는 Skill (`cook-meal/SKILL.md`)
  7. Harness Engineering (컨텍스트, 도구, 권한, 오프라인 담장)
  8. 2단계: Agent 만들기 (`dolsoe.md` 시각별 분기)
  9. Flow와 Loop (단방향 vs 되풀이 비교)
  10. Loop 실행 스크립트 (`scripts/draw.sh`)
  11. Loop 실행 프롬프트 (`@dolsoe`)
  12. 3단계: 마름 Orchestrator (`maleum.md`)
  13. 4단계: 언년이 Evaluator (`eonnyeon.md`)
  14. Graph Engineering 전체 지도 (종합 상태 전이 SVG 다이어그램)
  15. Local Checklist (5단계 로컬 실행 체크리스트)
  16. AI Tool 방법론 지도 (7대 확장 층)
  17. 5단계: 돌쇠들의 마을 게시판 (`agent-card.json` + A2A)
  18. 6단계: Spec-Driven Development (`AGENTS.md`, `specs/`, `docs/adr/`)
  19. 7단계: 돌쇠의 도서관 (`library/` RAG vs LLM Wiki)
  20. Beyond the Graph (5대 확장 기법 및 조사 출처)

### 확인 장면 및 미리보기 방법
1. 로컬 미리보기: `python -m http.server 8000` 실행 후 브라우저에서 `http://localhost:8000/slides/my-dolsoe-ai/` 및 `http://localhost:8000/` 접속
2. 검증 완료: 20개 슬라이드 전체 넘김, 코드 복사 버튼 작동, SVG 접근성/인쇄 호환성, `slides.json` 매니페스트 연동 100% 통과

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
사용자가 제공한 조선시대 일꾼 비유 기반의 OpenCode 에이전트 설계 교육용 PPTX(20장)를 누락 없이 1:1로 웹 슬라이드화하고, 코드 블록을 템플릿과 동일하게 복사 가능하도록 구현함.

### 제약 (Constraints)
- 공유 파일(`deck-base.css`, `vendor/`, `scripts/`) 불변 유지.
- `slides.json`에 유효한 JSON 포맷으로 `my-dolsoe-ai` 항목 추가.
- 모든 SVG 요소는 `role="img"`, `aria-label`, `visually-hidden` 낭독기 텍스트 구비.
- 0개 CDN 의존 (완전한 오프라인 자기완결성).

### 검증 결과
- `python scripts/verify_deck.py` 실행 통과 (JSON 무결성, 5개 덱 링크 정합성, 뷰포트 안전, 외부 의존성 0건, 20개 섹션 일치).
