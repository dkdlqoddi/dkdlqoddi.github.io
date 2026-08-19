# AI Agent Skills Philosophy 작업 보고서

- 날짜: 2026-08-19
- 관련 문서: [2026-08-19-ai-agent-skills-philosophy-explainer.md](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-08-19-ai-agent-skills-philosophy-explainer.md)

## Human

### 요약

인공지능 코딩 도구들의 스킬과 철학을 소개하는 11장의 슬라이드를 만들었습니다. 각 도구의 실제 작동 방식을 조사하여 정확한 다이어그램으로 전면 수정했고 핵심 요약 설명을 덧붙였습니다. 클로드 코드, 오픈코드, 코덱스 등 최신 에이전트들의 특징을 한눈에 비교할 수 있습니다.

### 리뷰 포인트

- **신규 슬라이드 문서**: `slides/ai-agent-skills-philosophy/index.html` — 총 10가지(oh-my-opencode, superpower, grill-me, ponytail, fablize, blindspot-flow, Copilot Workspace, Aider, Devin, LangChain Data Agent) 스킬에 대한 아키텍처 흐름도를 확인합니다.
- **매니페스트 연동**: `slides.json` — 랜딩 페이지에서 접근 가능하도록 정상적으로 등록되었는지 확인합니다.

---

## Agent 섹션

### 구현 의도
- 각 스킬의 핵심 철학을 설명하기 위해 텍스트 나열보다 시스템 구성도를 활용하여 직관성을 높임.
- 1페이지당 1개의 도구만 배치하여 정보 과부하를 막고, 다이어그램 가독성을 확보함.
- `dkdlqoddi.github.io`의 다크 테마 및 SVG `.dim`, `.bright` 위계 구조를 일관되게 차용함. LLM 노드는 `#00dddd`(시안) 색상으로 구분함.

### 제약사항
- 외부 플러그인 로드 불가 제약 준수.
- 인쇄용 호환성을 위해 `currentColor`와 순수 SVG `<g>` 태그 및 속성만을 사용하여 디자인함.

### 고려된 엣지케이스
- 텍스트 길이 제한에 따른 SVG 뷰포트 오버플로어 방지 (`viewBox` 및 넉넉한 너비 설정).
- 애니메이션 모션 줄이기(`prefers-reduced-motion: reduce`) 대응을 위해 템플릿의 `@media` 룰을 유지함.

### 의도적 범위 제외
- 실무를 위한 커맨드 라인 명령어 예시나 상세 플러그인 설정 방법. (목적은 사용법이 아닌 '철학'과 '구조'의 비교임)
