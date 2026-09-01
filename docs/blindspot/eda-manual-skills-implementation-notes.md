# '나만의 돌쇠 AI 만들기' EDA 매뉴얼 수집 스킬 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 슬라이드별 매뉴얼 수집 워크플로우 개편 매핑

1. **표지 (Slide 1)**: EDA 3대 MCP(JedAI · Siemens · SNPS) 연동 — "최신 매뉴얼을 수집해 지식화하는 스마트 일꾼 돌쇠".
2. **비유 체계 (Slide 2)**:
   - Skill: 3대 EDA MCP를 호출해 최신 매뉴얼을 읽어오는 일 단위
   - Agent: 질문/이슈에 맞춰 어떤 툴의 최신 매뉴얼을 읽을지 스스로 고르는 돌쇠
   - Orchestrator: 전사 EDA 매뉴얼 수집과 종합 분석을 분배하는 마름
   - Harness: EDA MCP 인터페이스 바인딩 및 사내 도서관(`library/`) 담장
   - Flow: 매뉴얼 검색 &rarr; 내용 추출 &rarr; 지식 저장 단방향 순서
   - Loop: 필요한 기술 사양을 완전히 찾을 때까지 질의를 튜닝하는 반복
   - Graph: 3대 매뉴얼 수집, 검증, 사내 위키 구축을 엮은 전체 지도
3. **디렉터리 레이아웃 (Slide 3)**:
   - `skills/`: `fetch-jedai-manual/`, `fetch-siemens-manual/`, `fetch-snps-manual/`
   - `agents/`: `dolsoe.md`, `gaeddong.md`, `maleum.md`, `eonnyeon.md`
   - `scripts/`: `fetch_jedai.sh`, `fetch_siemens.sh`, `fetch_snps.sh`
4. **1단계 스킬 1 (Slide 4)**: `fetch-jedai-manual/SKILL.md` (Cadence JedAI MCP로 최신 AI/ML 매뉴얼 조회 및 저장).
5. **1단계 스킬 2 (Slide 5)**: `fetch-siemens-manual/SKILL.md` (Siemens Calibre MCP로 최신 DRC/LVS 매뉴얼 조회 및 저장).
6. **1단계 스킬 3 (Slide 6)**: `fetch-snps-manual/SKILL.md` (Synopsys SNPS MCP로 최신 합성/STA 매뉴얼 조회 및 저장).
7. **Harness Engineering (Slide 7)**: MCP 매뉴얼 도구 셋, 사내 로컬 도서관, 기밀 문서 외부 반출 차단 담장.
8. **2단계 Agent (Slide 8)**: `dolsoe.md` (EDA 툴 유형별 최신 매뉴얼 스킬 자동 라우팅).
9. **Flow와 Loop (Slide 9)**: 매뉴얼 수집 Flow & 에러 해결 항목 탐색 Loop.
10. **Loop 스크립트 (Slide 10)**: `scripts/fetch_snps.sh` (SNPS_MCP로 최신 매뉴얼을 읽어와 완전한 문서가 될 때까지 Loop).
11. **Loop 프롬프트 (Slide 11)**: `@dolsoe` 3대 툴 최신 매뉴얼 검색 및 요약 지시문.
12. **3단계 마름 (Slide 12)**: `maleum.md` (Cadence/Synopsys 돌쇠 & Siemens 개똥이 매뉴얼 분배 및 통합).
13. **4단계 언년이 (Slide 13)**: `eonnyeon.md` (매뉴얼 최신 버전 일치성 & 목차 완결성 Sign-off 판정).
14. **Graph 전체 지도 (Slide 14)**: 3대 매뉴얼 수집 스킬과 4명의 에이전트가 연결된 상태 전이 SVG 다이어그램.
15. **Local Checklist (Slide 15)**: 3대 매뉴얼 MCP 스킬 로컬 환경 구성 5단계.
16. **방법론 지도 (Slide 16)**: 매뉴얼 기반 RAG, LLM Wiki, Spec-Driven 지식화.
17. **5단계 마을 게시판 (Slide 17)**: `agent-card.json` (`fetch-jedai-manual`, `fetch-snps-manual` 명시).
18. **6단계 Spec-Driven (Slide 18)**: `specs/001-manual-sync.md`.
19. **7단계 돌쇠의 도서관 (Slide 19)**: `library/` (3대 EDA 툴 최신 매뉴얼 아카이브).
20. **Beyond (Slide 20)**: EDA MCP 표준, 지식 검색 Evals, HITL 등.
