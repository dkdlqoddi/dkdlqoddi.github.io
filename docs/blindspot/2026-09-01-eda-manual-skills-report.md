# '나만의 돌쇠 AI 만들기' EDA 3대 MCP 매뉴얼 수집 스킬 전환 작업 보고서

- 날짜: 2026-09-01
- 대상: `slides/my-dolsoe-ai/index.html`, `slides.json`
- 퀴즈: `docs/blindspot/quiz/2026-09-01-eda-manual-skills.html` — 통과 확인 필수

## Human 섹션

### 요약
사용자의 요청에 따라 스킬 이름 자체에서 `-mcp` 접미사를 제거하고, **각 벤더의 MCP를 호출하여 최근 추가된 최신 매뉴얼을 읽어오는 실무 스킬 3종**으로 명확히 재정의 및 전체 파이프라인 동기화를 완료했습니다.
1. **1단계 스킬 3종 전환**:
   - **`fetch-jedai-manual` (Slide 4)**: `jedai mcp`를 호출해 최근 추가된 Cadence JedAI 매뉴얼을 조회·저장
   - **`fetch-siemens-manual` (Slide 5)**: `Siemens_MCP`를 호출해 최근 추가된 Siemens Calibre/EDA 매뉴얼을 조회·저장
   - **`fetch-snps-manual` (Slide 6)**: `SNPS_MCP`를 호출해 최근 추가된 Synopsys 매뉴얼을 조회·저장
2. **2단계 이후 파이프라인 전면 연계**:
   - **Agent (`@dolsoe`, Slide 8)**: 툴 유형/질문에 따라 알맞은 매뉴얼 수집 스킬을 자동 선택·실행
   - **Flow & Loop (Slide 9~11)**: 매뉴얼 수집 Flow 및 누락된 기술 문서/예제가 확보될 때까지 키워드를 튜닝하는 Loop 스크립트/프롬프트
   - **마름 (`@maleum`, Slide 12)**: Cadence/Synopsys 돌쇠와 Siemens 개똥이에게 매뉴얼 수집을 배분하고 지식 통합
   - **언년이 (`@eonnyeon`, Slide 13)**: 수집된 매뉴얼의 릴리즈 최신성 및 필수 목차 완결성을 검증하는 Sign-off 판정
   - **Graph 전체 지도 (Slide 14)**: 3대 매뉴얼 수집 스킬과 4명의 에이전트가 연결된 완성형 상태 전이 SVG 다이어그램
   - **체크리스트 & 도서관 (Slide 15~20)**: 최신 EDA 매뉴얼 지식 베이스(`library/`) 구축, A2A 매뉴얼 공유, 사내 RAG/LLM Wiki 구축
3. **No-Scroll 레이아웃 유지**: 20개 슬라이드 전체가 960×700 캔버스 내에 스크롤 0건으로 완결 표출.

### 확인 장면 및 미리보기
- 로컬 웹 서버: `python -m http.server 8000`
- 발표자료: `http://localhost:8000/slides/my-dolsoe-ai/`

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
"스킬 자체의 이름이 mcp가 아니라, mcp를 활용하는 skill"이라는 사용자 피드백에 따라 `fetch-*-manual` 형태의 동사형 실무 스킬로 변경하고, 2단계 이후의 전체 워크플로우를 최신 EDA 매뉴얼 수집 및 지식화 실무로 완벽히 정렬함.

### 제약 (Constraints)
- 공유 파일(`deck-base.css` 등) 불변 유지.
- 템플릿 코드 복사 버튼 기능 및 20개 슬라이드 전체의 No-Scroll 높이 예산 준수.
- 0개 CDN 의존성 및 SVG 접근성 규약 100% 만족.

### 검증 결과
- `python scripts/verify_deck.py` 통과 (20개 섹션, 6개 SVG 접근성, 5개 덱 링크 무결성).
