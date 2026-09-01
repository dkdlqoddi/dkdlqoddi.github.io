# '나만의 돌쇠 AI 만들기' EDA 3대 MCP 스킬 전환 및 워크플로우 개편 작업 보고서

- 날짜: 2026-09-01
- 대상: `slides/my-dolsoe-ai/index.html`, `slides.json`
- 퀴즈: `docs/blindspot/quiz/2026-09-01-eda-mcp-skills.html` — 통과 확인 필수

## Human 섹션

### 요약
`my-dolsoe-ai` 20개 슬라이드 전체를 실제 반도체/EDA 산업 표준 3대 벤더 MCP 스킬 기반으로 전면 개편했습니다.
1. **1단계 3대 EDA MCP 스킬 전환**:
   - **`jedai-mcp` (Cadence JedAI)**: 빅데이터/ML 설계 로그 마이닝 및 수율 최적화 MCP 스킬
   - **`siemens-mcp` (Siemens Calibre)**: GDS 레이아웃 DRC/LVS 물리 검증 및 DFM 분석 MCP 스킬
   - **`snps-mcp` (Synopsys SNPS)**: 논리 합성 및 STA 타이밍 슬랙(WNS/TNS) 평가 MCP 스킬
2. **2단계 이후 파이프라인 전면 연계**:
   - **Agent (`@dolsoe`)**: 설계 단계(합성, 물리검증, 분석)에 맞춰 적절한 EDA MCP 도구를 자동 선택·실행
   - **Flow & Loop**: RTL/SDC 입력에서 합성·DRC·분석으로 이어지는 Flow와, Timing Met(WNS >= 0.0ps) 달성까지 LLM이 파라미터를 튜닝하는 Loop 스크립트/지시문
   - **Orchestrator (`@maleum`)**: 프론트엔드/합성 담당 돌쇠와 백엔드/물리검증 담당 개똥이에게 일을 배분하고 리포트를 종합
   - **Evaluator (`@eonnyeon`)**: DRC 위반 0건 및 타이밍 마진을 검증하는 파운드리 테이프아웃 Sign-off 판정
   - **Graph 전체 지도**: 3대 EDA MCP와 마름·돌쇠·개똥이·언년이가 유기적으로 연결된 완성형 상태 전이 SVG 다이어그램
   - **체크리스트 & 방법론**: 사내 폐쇄망 EDA 라이선스 연동, PDK 룰덱 RAG/Wiki, Tapeout HITL 최종 승인
3. **No-Scroll 레이아웃 유지**: 20개 슬라이드 전체가 960×700 캔버스 내에 스크롤 0건으로 완결 표출.

### 확인 장면 및 미리보기
- 로컬 웹 서버: `python -m http.server 8000`
- 발표자료: `http://localhost:8000/slides/my-dolsoe-ai/`

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
사용자의 요청에 따라 가상 집안일 스킬을 실제 반도체 설계 3대 벤더 MCP(JedAI, Siemens, SNPS)로 교체하고, 2단계 이후의 지시문, 스크립트, 마름/언년이 판정 기준, 그래프 다이어그램을 반도체 EDA 자동화 실무 맥락으로 완벽히 동기화함.

### 제약 (Constraints)
- 공유 파일(`deck-base.css` 등) 불변 유지.
- 템플릿 코드 복사 버튼 기능 및 20개 슬라이드 전체의 No-Scroll 높이 예산 준수.
- 0개 CDN 의존성 및 SVG 접근성 규약 100% 만족.

### 검증 결과
- `python scripts/verify_deck.py` 통과 (20개 섹션, 6개 SVG 접근성, 5개 덱 링크 무결성).
