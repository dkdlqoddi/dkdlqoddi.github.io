# Python Automation: DX vs AX 설계 문서

- 날짜: 2026-08-19
- 입력: [requirements](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-08-19-dx-vs-ax-automation-requirements.md) / [unknowns](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-08-19-dx-vs-ax-automation-unknowns.md)

## 목적과 배경

사내 Python 자동화가 디지털 전환(DX)에서 AI 전환(AX)으로 발전하는 과정을 설명하는 발표자료입니다.
텍스트는 최소화하고 흐름도(SVG 다이어그램)와 코드 예시를 주 전달 수단으로 사용합니다.
청중은 사내에서 opencode 도구를 이미 사용 중인 엔지니어입니다.

## 결정사항

| # | 결정 | 근거 |
|---|---|---|
| 1 | 슬라이드 폴더: `slides/dx-vs-ax-automation/` | 사용자 선택 |
| 2 | 흐름 순서: 개념 정의 → 일반 vs LLM 비교 → Flow Chart → 코드 예시 → 추가 방법 → 끝 | 사용자 선택 (개념 먼저, 구현 나중에) |
| 3 | 모든 다이어그램은 인라인 SVG로 구현 | 기존 덱 관례: SVG는 인쇄 시 배치가 보존됨, div는 reveal 인쇄 규칙에 의해 깨짐 |
| 4 | Python 코드는 50자 이내 줄길이, 슬라이드당 12줄 이내 | 960×700 캔버스에서 0.58em 폰트의 가독성 한계 |
| 5 | 코드 강조는 CSS 클래스로 직접 처리 | reveal.js 플러그인이 없으므로 highlight.js 사용 불가 |
| 6 | SVG 색상은 currentColor 기반, 강조색만 직접 지정 | 인쇄 시 검정 자동 전환을 위해 |
| 7 | HUD 프레임과 3D 은하 배경 포함 | 기존 덱 관례 |
| 8 | opencode 기본 소개 생략, 연동 패턴에 집중 | 청중이 이미 도구를 알고 있음 |

## 검토한 대안과 트레이드오프

| 결정 | 채택안 | 기각안 | 기각 이유 |
|---|---|---|---|
| 다이어그램 구현 | 인라인 SVG (currentColor 기반) | div/CSS Grid 레이아웃 | reveal.js 인쇄 규칙이 div를 display:block으로 바꿔 배치가 깨짐 |
| 코드 강조 | CSS 클래스로 수동 강조 (.bright, .dim) | highlight.js 플러그인 | vendor/reveal.js/dist/plugin/ 폴더가 존재하지 않아 404 발생 |
| LLM 연동 방법 수 | 4가지 (subprocess, Langchain, OpenAI SDK, HTTP 직접) | 2가지만 (subprocess, Langchain) | 사용자가 "추가할 수 있는 방법이 있다면 추가"를 요청 |
| 코드 예시 수준 | 핵심 패턴만 (3~8줄) | 전체 에러 처리 포함 | 캔버스 공간 제약 (12줄 한계)과 시각자료 중심 원칙 |

## 동작 방식

발표자료는 다음 구간으로 구성됩니다.

**구간 1: DX와 AX 개념 정의 (1장)**
한 장의 SVG 비교 다이어그램으로 DX(규칙 기반 자동화)와 AX(LLM 기반 자동화)를 나란히 보여줍니다.

**구간 2: 일반 Automation vs LLM Automation (1장)**
규칙 기반 분기 흐름과 LLM 판단 기반 흐름을 대비하는 SVG 다이어그램입니다.
규칙 기반은 고정된 조건 분기(if/else)를 보여주고, LLM 기반은 자연어 이해와 맥락 판단을 보여줍니다.

**구간 3: DX vs AX Flow Chart 비교 (2장, auto-animate 모핑)**
첫 장에서 DX의 일반적인 자동화 흐름도를 보여줍니다.
다음 장에서 같은 흐름도가 AX로 확장되며, 추가 커버 영역이 시각적으로 강조됩니다.
AX에서 새로 추가되는 단계(자연어 이해, 동적 판단, 자기 치유 등)는 밝은 테두리와 글로우 효과로 구분합니다.

**구간 4: 사내 LLM 연동 방법 (4장)**
각 방법마다 한 장씩, 핵심 Python 코드 예시를 보여줍니다.

1. subprocess로 opencode headless 호출: `subprocess.run(["opencode", ...])` 패턴
2. Langchain으로 사내 LLM 연결: `ChatOpenAI(base_url=...)` 패턴
3. OpenAI SDK 직접 사용: `OpenAI(base_url=...)` 패턴
4. HTTP 직접 호출: `requests.post(...)` 패턴

**구간 5: 마무리 (1장)**
발표 기록 랜딩 페이지로 돌아가는 링크를 포함합니다.

## 의도적 범위 제외

- **에러 처리 전체 코드**: 캔버스 공간 제약으로 핵심 패턴만 보여주고, 상세 에러 처리는 다루지 않습니다.
- **LLM 모델 비교(성능, 비용)**: 발표 주제가 연동 방법이므로, 모델 자체의 품질 비교는 범위 밖입니다.
- **RAG, 에이전트 프레임워크 상세 설명**: LangGraph, CrewAI 등은 언급만 하고 코드 예시를 포함하지 않습니다.
- **사내 LLM API 실제 주소/인증 정보**: 보안상 발표자료에 실제 엔드포인트를 넣지 않고, 자리표시자를 사용합니다.
- **white 테마 지원**: 기존 덱 관례대로 dark 테마만 사용합니다.

## 열린 질문

| 질문 | 해소 계획 |
|---|---|
| (없음 — 모든 질문이 인터뷰와 코드 근거로 해소됨) | — |
