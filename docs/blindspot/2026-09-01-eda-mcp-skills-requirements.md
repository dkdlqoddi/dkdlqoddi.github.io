# '나만의 돌쇠 AI 만들기' EDA MCP 스킬 전환 요구사항 정의서

- 문서 ID: 2026-09-01-eda-mcp-skills-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 날짜: 2026-09-01

## 1. 목적 및 배경
기존의 가상 집안일 스킬(물 긷기, 장작 패기, 밥 짓기)을 실제 반도체/EDA 산업 표준 3대 벤더 MCP 스킬인 **JedAI MCP (Cadence)**, **Siemens_MCP (Siemens Calibre/EDA)**, **SNPS_MCP (Synopsys)**로 전면 전환하고, 이에 맞추어 2단계 에이전트, Flow/Loop, 오케스트레이터(마름), 평가자(언년이), 전체 그래프 다이어그램 및 방법론 지도 전체를 일관되게 개편합니다.

## 2. 세부 요구사항

### 2.1 1단계 3대 EDA MCP Example Skill 정의
1. **jedai-mcp (Cadence JedAI)**:
   - 빅데이터/AI 분석, 수율 예측, 설계 레이아웃 데이터 마이닝 MCP 도구 호출.
   - 절차: 설계 로그 분석 → JedAI MCP 도구(`jedai_analytics_query`) 호출 → 최적화 가이드 추출 → 완료 조건(인사이트 로그 기록).
2. **siemens-mcp (Siemens Calibre/EDA)**:
   - Calibre 기반 DRC(Design Rule Check), LVS, DFM 물리 검증 MCP 도구 호출.
   - 절차: GDS/OASIS 레이아웃 파일 읽기 → Siemens MCP(`siemens_run_drc`) 호출 → DRC 에러 로그 파싱 → 완료 조건(`data/drc_summary.rpt` 에러 0건).
3. **snps-mcp (Synopsys SNPS)**:
   - 논리 합성, STA(Static Timing Analysis), PPA(Power/Performance/Area) 최적화 MCP 도구 호출.
   - 절차: Netlist/SDC 읽기 → SNPS MCP(`snps_sta_analyze`) 호출 → Setup/Hold Slack 확인 → 완료 조건(WNS >= 0.0ps).

### 2.2 2단계 이후 전체 연계 개편
1. **Slide 3 (디렉터리 레이아웃)**: `skills/`에 `jedai-mcp/`, `siemens-mcp/`, `snps-mcp/` 반영.
2. **Slide 7 (Harness)**: EDA MCP 도구 셋(`jedai_*`, `siemens_*`, `snps_*`) 바인딩 및 폐쇄망 MCP 권한 제어.
3. **Slide 8 (Agent)**: `@dolsoe`가 설계 단계(합성, 물리검증, 빅데이터 분석)에 따라 적절한 EDA MCP Skill을 라우팅.
4. **Slide 9~11 (Flow & Loop)**: EDA 타이밍 클로저(Timing Closure) 및 DRC 수렴 루프 스크립트/프롬프트.
5. **Slide 12 (마름 Orchestrator)**: 합성/타이밍 담당(@dolsoe)과 물리검증/분석 담당(@gaeddong)에게 일을 배분하는 마름.
6. **Slide 13 (언년이 Evaluator)**: DRC 에러 0건 및 Timing Slack 양수 여부를 대조해 Tapeout PASS / 재작업 FAIL 판정.
7. **Slide 14 (Graph 전체 지도)**: EDA MCP 기반 전체 종합 상태 전이 SVG 다이어그램.
8. **Slide 15~20 (체크리스트, 게시판, Spec, RAG/Wiki, Beyond)**: EDA PDK/룰덱 RAG, EDA 라이선스 샌드박싱, Tapeout HITL 승인 등 반도체 EDA 맥락 일치화.

### 2.3 제약사항
- 960×700 캔버스 예산 내 **No-Scroll 레이아웃** 100% 유지.
- 템플릿 코드 복사 버튼 동작 및 다크 스페이스 HUD 테마 보존.
- 오프라인 자기완결성 및 접근성 규약 준수.
