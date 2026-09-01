# '나만의 돌쇠 AI 만들기' opencode.json Agent 등록 슬라이드 불확실성 및 해소 기록 (Unknowns)

- 문서 ID: 2026-09-01-opencode-agent-config-unknowns
- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 식별된 불확실성 및 자체 해소 결정

| # | 불확실성 항목 | 의사결정 및 자체 해소 근거 | 결과 |
|---|---|---|---|
| 1 | `opencode.json` 내 Agent 설정 스키마 표현 | OpenCode 표준 스키마(`"agent": { "<name>": { "description", "mode", "model", "skills" } }`)를 활용하여 가장 핵심적인 4대 필드만 깔끔하게 시각화 | 표준 JSON 구조 채택 |
| 2 | `.opencode/agents/dolsoe.md`와의 관계 설명 | "어디에 쓰는가?"라는 의문을 해소하기 위해 `.md`는 프롬프트 지시문(행동 규칙), `opencode.json`은 모델/스킬/시스템 바인딩(인프라 설정)으로 역할을 명확히 구분 설명 | 상호 보완 관계 명확화 |
| 3 | 신규 슬라이드 추가에 따른 전체 No-Scroll 유지 | 10줄 이내의 간결한 JSON 블록과 3개의 슬림 패널 카드를 배치하여 신규 슬라이드의 렌더링 높이를 ~350px로 통제 | 21개 전 슬라이드 No-Scroll 유지 |
