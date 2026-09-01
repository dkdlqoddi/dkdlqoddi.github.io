# '나만의 돌쇠 AI 만들기' EDA MCP 활용 최신 매뉴얼 수집 스킬 개편 요구사항 정의서

- 문서 ID: 2026-09-01-eda-manual-skills-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 날짜: 2026-09-01

## 1. 목적 및 배경
스킬 이름 자체를 `-mcp`로 명명하는 대신, **MCP 서버를 호출하여 특정 비즈니스 작업(최근 추가된 매뉴얼 읽어오기)을 수행하는 실무 스킬**로 명확히 분리하고 재정의합니다.
1. `jedai mcp`를 호출해 최근 추가된 Cadence JedAI 매뉴얼을 읽어오는 스킬 (`fetch-jedai-manual`)
2. `Siemens_MCP`를 호출해 최근 추가된 Siemens Calibre/EDA 매뉴얼을 읽어오는 스킬 (`fetch-siemens-manual`)
3. `SNPS_MCP`를 호출해 최근 추가된 Synopsys 매뉴얼을 읽어오는 스킬 (`fetch-snps-manual`)

## 2. 세부 요구사항

### 2.1 3대 매뉴얼 수집 스킬 정의
1. **`fetch-jedai-manual` (Cadence JedAI)**:
   - `jedai mcp` 도구(`jedai_read_recent_manuals`)를 호출하여 최근 업데이트된 AI/ML 수율 분석 매뉴얼을 조회하고 로컬에 저장.
   - 완료 조건: `data/jedai_manual.md`에 최신 매뉴얼 본문 및 변경사항 기록.
2. **`fetch-siemens-manual` (Siemens Calibre/EDA)**:
   - `Siemens_MCP` 도구(`siemens_fetch_latest_docs`)를 호출하여 최근 추가된 DRC/LVS 룰덱 및 물리검증 매뉴얼을 수집.
   - 완료 조건: `data/siemens_manual.md`에 최신 DRC 매뉴얼 기록.
3. **`fetch-snps-manual` (Synopsys SNPS)**:
   - `SNPS_MCP` 도구(`snps_get_recent_manual`)를 호출하여 최근 릴리즈된 합성 및 PrimeTime STA 매뉴얼을 수집.
   - 완료 조건: `data/snps_manual.md`에 최신 합성 매뉴얼 기록.

### 2.2 2단계 이후 전체 파이프라인 동기화
1. **Slide 3 (디렉터리 구조)**: `skills/`에 `fetch-jedai-manual/`, `fetch-siemens-manual/`, `fetch-snps-manual/` 반영.
2. **Slide 7 (Harness)**: 3대 EDA MCP 매뉴얼 인터페이스 바인딩 및 폐쇄망 문서 보호.
3. **Slide 8 (Agent `@dolsoe`)**: 툴 유형/질문에 따라 적절한 매뉴얼 수집 스킬을 선택·실행하는 똑똑한 리서치 일꾼.
4. **Slide 9~11 (Flow & Loop)**: 3대 툴 최신 매뉴얼 수집 Flow 및 누락된 기술 문서가 확보될 때까지 키워드를 변경하며 튜닝하는 Loop 스크립트/프롬프트.
5. **Slide 12 (마름 `@maleum`)**: Cadence/Synopsys 매뉴얼 담당 돌쇠와 Siemens 매뉴얼 담당 개똥이에게 지식을 배분하고 리포트를 병합.
6. **Slide 13 (언년이 `@eonnyeon`)**: 수집된 매뉴얼의 최신 버전 일치성, 목차 완결성, 필수 키워드 포함 여부를 검증하는 검사역 (PASS / FAIL).
7. **Slide 14 (Graph 전체 지도)**: 3대 매뉴얼 수집 스킬과 4명의 에이전트가 연동된 완성형 상태 전이 SVG 다이어그램.
8. **Slide 15~20 (체크리스트, 게시판, Spec, RAG/Wiki, Beyond)**: 최신 EDA 매뉴얼 지식 베이스(`library/`) 구축, A2A 매뉴얼 공유, 사내 RAG/Wiki 구축과 일치화.

### 2.3 제약사항
- 960×700 캔버스 예산 내 **No-Scroll 레이아웃** 100% 유지.
- 템플릿 코드 복사 버튼 동작 및 다크 스페이스 HUD 테마 보존.
- 오프라인 자기완결성 및 접근성 규약 준수.
