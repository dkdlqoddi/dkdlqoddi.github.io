# '나만의 돌쇠 AI 만들기' 웹 발표자료 요구사항 정의서

- 문서 ID: 2026-09-01-my-dolsoe-ai-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 원본 자료: `C:\Users\dkdlq\Documents\나만의 돌쇠 AI 만들기.pptx` (총 20장)

## 1. 목적 및 배경
추상적인 AI 에이전트/하네스 엔지니어링 개념(Skill, Agent, Harness, Flow, Loop, Orchestrator, Evaluator, Graph, Agent SNS, Spec-Driven, RAG/Wiki 등)을 '조선시대 집안 일꾼(돌쇠, 개똥이, 마름, 언년이)'이라는 직관적인 비유로 쉽게 전달하는 20장 분량의 웹 기반 reveal.js 발표자료를 제작합니다.

## 2. 핵심 요구사항

### 2.1 슬라이드 구성 및 원본 충실도 (20개 슬라이드 전체 반영)
1. **표지 (Slide 1)**: Harness Engineering → Graph Engineering, "나만의 돌쇠 AI 만들기", Skill → Agent → Orchestrator
2. **비유 체계 (Slide 2)**: 왜 하필 '돌쇠'인가 — Skill(단순 일꾼), Agent(판단하는 일꾼), Orchestrator(마름), Harness(마당/연장), Flow(작업도), Loop(되풀이), Graph(전체 지도)
3. **폴더 및 파일 배치 (Slide 3)**: `my-dolsoe/` 프로젝트 구조 트리 및 네이밍/상대경로 규칙 4가지
4. **1단계: 물 긷는 Skill (Slide 4)**: `draw-water/SKILL.md` 코드 및 frontmatter/name 규칙, 실행자 돌쇠, 미니 그래프
5. **1단계: 장작 패는 Skill (Slide 5)**: `chop-wood/SKILL.md` 코드 및 상대경로 규칙, 실행자 돌쇠, 미니 그래프
6. **1단계: 밥 짓는 Skill (Slide 6)**: `cook-meal/SKILL.md` 코드 및 선행조건/로그 기록, 실행자 개똥이, 미니 그래프
7. **Harness Engineering (Slide 7)**: 마당 짓기 4대 축(컨텍스트, 도구, 권한, 오프라인 보장) 및 담장 설정 코드
8. **2단계: Agent 만들기 (Slide 8)**: `dolsoe.md` 라우팅 지시문 및 시각별 분기 흐름도
9. **Flow와 Loop (Slide 9)**: 한 줄기와 되풀이 비교, Flow 단계 다이어그램, Loop 셸 스크립트 요약
10. **Loop 실행 스크립트 (Slide 10)**: `scripts/draw.sh` bash 스크립트 전문 및 3가지 핵심 원칙
11. **Loop 실행 프롬프트 (Slide 11)**: `@dolsoe` 프롬프트 전문 및 조건·상한·보고 원칙
12. **3단계: 마름 Orchestrator (Slide 12)**: `maleum.md` 오케스트레이터 및 돌쇠·개똥이 위임/병합/재배정 구조
13. **4단계: 언년이 Evaluator (Slide 13)**: `eonnyeon.md` 검사역 및 PASS/FAIL 판정 루프
14. **Graph Engineering 전체 지도 (Slide 14)**: 마름, 돌쇠, 개똥이, 언년이가 유기적으로 연결된 완성형 상태 전이 그래프 SVG
15. **Local Checklist (Slide 15)**: 오늘 만든 것 그대로 돌려보기 5단계 체크리스트
16. **AI Tool 방법론 지도 (Slide 16)**: 그래프 다음의 7가지 확장 층(Agent SNS, Spec-Driven, ADR, RAG/Wiki, Context, Evals, Sandboxing)
17. **5단계: 마을 게시판 (Slide 17)**: `agent-card.json` + Blackboard 패턴 3단계 동작
18. **6단계: 문서화 (Slide 18)**: AGENTS.md, specs/, docs/adr/ 3대 문서 체계
19. **7단계: 돌쇠의 도서관 (Slide 19)**: RAG vs LLM Wiki 구조 및 `library/` 디렉터리 설계
20. **Beyond the Graph 요약 (Slide 20)**: 5가지 추가 방법론 및 2026 조사 출처

### 2.2 기술 및 디자인 제약사항 (CLAUDE.md 준수)
- **오프라인 자기완결성**: CDN 의존성 0건. `../../vendor/` 상대 경로 참조.
- **다크 스페이스 HUD 테마**: `deck-base.css?v=2` 링크, 3D 별빛 은하 배경 (`galaxy-3d-bg`), EVA VIEW 레이아웃.
- **코드 영역 표준화**: `<pre><code class="...">` 구조 및 `shared/code-copy.js`, `shared/code-copy.css` 복사 버튼 연동.
- **시각화 및 접근성**: 모든 SVG는 `role="img"`, `aria-label`, 직전 `visually-hidden` 문단 구비, `currentColor` 기반 테마 호환.
- **인쇄 및 모션 안전**: `@media print` 대비 및 `@media (prefers-reduced-motion: reduce)` 애니메이션 정지 처리.
- **저장소 매니페스트**: `slides.json`에 `my-dolsoe-ai` 항목 등록.
