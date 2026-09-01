# '나만의 돌쇠 AI 만들기' EDA MCP 스킬 전환 불확실성 및 해소 기록 (Unknowns)

- 문서 ID: 2026-09-01-eda-mcp-skills-unknowns
- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 식별된 불확실성 및 자체 해소 결정

| # | 불확실성 항목 | 의사결정 및 자체 해소 근거 | 결과 |
|---|---|---|---|
| 1 | EDA 3대 MCP 스킬 명칭 통일 | 사용자의 명시("jedai mcp", "Siemens_MCP", "SNPS_MCP")를 OpenCode 스킬 표준 네이밍 규칙(소문자, 하이픈)에 맞추어 `jedai-mcp`, `siemens-mcp`, `snps-mcp`로 정의하고, 설명 본문에서 대소문자 공식 명칭 병기 | `jedai-mcp`, `siemens-mcp`, `snps-mcp` 채택 |
| 2 | 돌쇠/마름/언년이 비유와의 결합 방식 | "조선시대 일꾼" 비유를 버리지 않고, "반도체 칩 설계 현장의 전문 일꾼 돌쇠가 EDA MCP 연장을 쥐고 일하는 구조"로 확장하여 직관적인 재미와 전문성을 동시에 확보 | 엔지니어링 일꾼 비유 유지 및 심화 |
| 3 | Evaluator(언년이)의 판정 기준 | EDA 분야의 핵심 정량 지표인 DRC Violation = 0, WNS(Worst Negative Slack) >= 0.0ps, Power 예산 충족 여부를 판정 기준으로 설정 | 구체적이고 현실적인 EDA Sign-off 판정 |
| 4 | 20개 슬라이드 전체의 노스크롤 유지 | 코드 블록과 설명 카드의 내용이 EDA 전문 지식으로 심화되더라도 폰트 0.51em, 컴팩트 2단 패널을 유지하여 960x700 뷰포트 내 완벽 수용 | 전 슬라이드 No-Scroll 유지 |
