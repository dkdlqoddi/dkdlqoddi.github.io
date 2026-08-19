# AI Agent Skills Philosophy 미지 영역 (Unknown Unknowns)

- 날짜: 2026-08-19
- 입력: [2026-08-19-ai-agent-skills-philosophy-requirements.md](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-08-19-ai-agent-skills-philosophy-requirements.md)
- 스캔 렌즈: conventions / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 도메인 지식: 추가 4가지 스킬/에이전트 목록이 비어 있음. | 추가로 소개할 4개의 도구(Codex 1개, 개발 1개, 기획 1개, 도메인 1개)를 무엇으로 선정할지? | Codex: **GitHub Copilot Workspace** / 개발: **Aider** / 기획: **Devin** / 도메인: **LangChain Agent** 로 자체 선정함. | 자체 해소 |
| 2 | conventions: `dkdlqoddi.github.io`의 다크 테마 SVG 규칙 (기존 dx-vs-ax 덱 참고) | 10장의 슬라이드 다이어그램 디자인을 어떻게 통일할지? | 모듈 성격별로 색상을 부여함(LLM 판단: 시안색, 외부 도구: 회색, 사용자 입력: 테마 기본색). | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 자체 선정한 4개의 추가 스킬(Copilot Workspace, Aider, Devin, LangChain Agent)을 그대로 적용할 것인가? | 사용자가 선호하는 다른 특정 도구가 있을 수 있음. | `implementation_plan.md` 리뷰 시 (현재) |

## 스캔 원본 요약

### conventions
- 이전 `dx-vs-ax-automation` 작업에서 확립된 바와 같이, SVG는 `currentColor`, `stroke`, `fill` 등을 이용하며 `dim` 클래스와 `bright` 클래스, 혹은 `#00dddd`(시안) 색상을 사용하여 맥락과 포인트를 구분한다. 플러그인이 금지되어 있으므로 순수 HTML/CSS 구조로 구성해야 함.

### domain
- GitHub Copilot Workspace: 통합 개발 환경 내에서의 흐름 중심 설계 철학 (에디터 내 문맥 유지).
- Aider: 터미널 기반의 빠른 상호작용과 git 연동을 통한 페어 프로그래밍 철학.
- Devin: 고수준 목표를 설정하면 완전히 자율적으로 계획과 실행을 반복하는 철학.
- LangChain Data Agent: 다양한 도구(API)와 결합하여 특정 도메인 로직을 수행하는 모듈화 철학.
