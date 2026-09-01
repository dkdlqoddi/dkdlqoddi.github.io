# '나만의 돌쇠 AI 만들기' EDA 매뉴얼 수집 스킬 불확실성 및 해소 기록 (Unknowns)

- 문서 ID: 2026-09-01-eda-manual-skills-unknowns
- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 식별된 불확실성 및 자체 해소 결정

| # | 불확실성 항목 | 의사결정 및 자체 해소 근거 | 결과 |
|---|---|---|---|
| 1 | 스킬 이름에서 `-mcp` 접미사 제거 및 동사형 네이밍 | 사용자의 명시("skill 자체의 이름이 mcp가 아니라, mcp를 활용하는 skill")에 따라 동작을 명확히 나타내는 `fetch-jedai-manual`, `fetch-siemens-manual`, `fetch-snps-manual`로 명명 | `fetch-*-manual` 표준 명명 채택 |
| 2 | MCP 도구와 스킬의 관계 표현 | SKILL.md 내부에서 각 벤더의 MCP 인터페이스(`jedai_read_recent_manuals`, `siemens_fetch_latest_docs`, `snps_get_recent_manual`)를 호출하는 구체적 절차를 명시하여 "MCP를 연장으로 쥐고 일하는 스킬"의 개념을 선명히 전달 | MCP 도구 호출 절차 명시 |
| 3 | Evaluator(언년이)의 검증 지표 | 수집된 매뉴얼 파일(`data/*_manual.md`)의 최신 릴리즈 날짜 확인, 필수 목차 완결성(API 파라미터 및 예제 포함 여부)을 판정 기준으로 설정 | 명확한 매뉴얼 검증 기준 수립 |
| 4 | 20개 슬라이드 전체의 노스크롤 유지 | 매뉴얼 수집 및 지식 관리 맥락으로 전체 지시문과 코드가 확장되어도 폰트 0.51em 및 컴팩트 2단 패널을 유지하여 960x700 뷰포트 내 완벽 수용 | 전 슬라이드 No-Scroll 유지 |
