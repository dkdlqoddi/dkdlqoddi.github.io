# Python Automation: DX vs AX 발표자료 요구사항

- 날짜: 2026-08-19
- 상태: 확정
- 관련 문서: 없음

## 요청 배경

Python 자동화(Automation) 관점에서 DX(디지털 전환)와 AX(AI 전환)의 차이를 설명하는 발표자료가 필요합니다.
텍스트 설명은 최소화하고, 흐름도(Flow Chart)와 다이어그램 같은 시각자료를 중심으로 구성합니다.
사내에서 이미 사용 중인 opencode 도구와 Langchain을 활용한 LLM 연동 방법까지 포함합니다.

## Unknowns 4분면

| 분면 | 항목 |
|---|---|
| Known Knowns (명시된 요구사항) | 덱 slug: `dx-vs-ax-automation` · 시각자료 위주 · DX/AX 개념 정의 · Flow Chart 비교 · 일반 Automation vs LLM Automation · subprocess opencode 방식 · Langchain 방식 · Python 코드 예시 포함 · 한글 위주(기술 용어만 영문) |
| Known Unknowns (답이 필요한 질문) | 인터뷰로 모두 해소됨 |
| Unknown Knowns (인터뷰로 드러난 암묵적 선호) | 슬라이드 순서: 개념 정의 → 일반 vs LLM 비교 → Flow Chart → 코드 예시 순 · 청중이 opencode를 이미 알고 있음 · 기존 덱과 동일한 한영 혼용 스타일 |
| Unknown Unknowns (미지 영역 — blindspot-pass 대상) | opencode headless run의 정확한 CLI 인터페이스 · Langchain에서 사내 LLM을 연결하는 구체적 설정값 |

## 확정 요구사항

1. **덱 slug**: `dx-vs-ax-automation` — 근거: 사용자 선택
2. **슬라이드 순서**: DX/AX 개념 정의 → 일반 Automation vs LLM Automation → Flow Chart 비교 (AX 확장 영역 강조) → 사내 LLM 연동 방법(subprocess + Langchain) → 끝 — 근거: 사용자 선택 (두 번째 순서 옵션)
3. **코드 포함 수준**: Python 코드 예시를 슬라이드에 포함 (코드 블록 슬라이드) — 근거: 사용자 선택
4. **텍스트 언어**: 한글 위주, 기술 용어만 영문 — 근거: 사용자 선택 (기존 덱 관례와 일치)
5. **opencode 설명 깊이**: 청중이 이미 아는 도구이므로 기본 소개는 생략, subprocess 호출 패턴에 집중 — 근거: 사용자 답변
6. **시각자료 중심**: 텍스트 최소화, SVG 다이어그램과 Flow Chart가 주요 전달 수단 — 근거: 사용자 명시 요청
7. **AX 강조**: Flow Chart에서 DX 대비 AX가 추가로 커버하는 영역을 시각적으로 강조 — 근거: 사용자 명시 요청

## 인터뷰 기록

| 질문 | 답변 | 아키텍처 영향 |
|---|---|---|
| 슬라이드 폴더 이름(slug) | `dx-vs-ax-automation` | 공유 URL 및 slides.json 등록 결정 |
| 슬라이드 흐름 순서 | 개념 → 일반 vs LLM → Flow Chart → 코드 예시 | 슬라이드 section 배치 순서 결정 |
| 코드 예시 포함 여부 | 코드 블록 슬라이드 포함 | pre/code 태그 슬라이드 추가 필요 |
| 텍스트 언어 비율 | 한글 위주, 기술 용어만 영문 | 기존 관례 유지 |
| opencode 호출 방식 | subprocess로 headless run 명령어 실행 | 코드 예시의 구체적 형태 결정 |
| 청중의 opencode 사전 지식 | 이미 알고 있는 도구 | opencode 기본 소개 생략, 연동 패턴에 집중 |

## 미해결 질문

- opencode headless run의 정확한 CLI 옵션과 출력 형식 → blindspot-pass에서 조사
- Langchain에서 사내 LLM API를 연결하는 구체적 코드 패턴 → blindspot-pass에서 조사
