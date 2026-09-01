# '나만의 돌쇠 AI 만들기' EDA MCP 스킬 전환 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 슬라이드별 EDA MCP 개편 매핑

1. **표지 (Slide 1)**: EDA 자동화 하네스 & 그래프 엔지니어링 실습 — "JedAI · Siemens · SNPS 3대 MCP를 부리는 설계 일꾼 돌쇠".
2. **비유 체계 (Slide 2)**:
   - Skill: EDA MCP 도구 호출 (JedAI / Siemens / SNPS 절차)
   - Agent: 설계 단계별 알맞은 MCP를 선택하는 설계자 돌쇠
   - Orchestrator: 프론트엔드/백엔드/검증 일꾼을 지휘하는 마름
   - Harness: EDA 라이선스, PDK 룰덱, MCP 권한 담장
   - Flow: Synthesis → P&R → DRC → Timing 검증 단방향 순서
   - Loop: Timing Slack 및 DRC 위반이 0이 될 때까지 파라미터 튜닝 반복
   - Graph: 전체 EDA 자동화 파이프라인 종합 지도
3. **디렉터리 레이아웃 (Slide 3)**:
   - `skills/`: `jedai-mcp/`, `siemens-mcp/`, `snps-mcp/`
   - `agents/`: `dolsoe.md`, `gaeddong.md`, `maleum.md`, `eonnyeon.md`
   - `scripts/`: `run_jedai.sh`, `run_calibre.sh`, `run_snps.sh`
4. **1단계 스킬 1 (Slide 4)**: `jedai-mcp/SKILL.md` (Cadence JedAI ML 빅데이터 분석 & 수율 최적화 MCP 도구 연동).
5. **1단계 스킬 2 (Slide 5)**: `siemens-mcp/SKILL.md` (Siemens Calibre DRC/LVS 물리 검증 MCP 도구 연동).
6. **1단계 스킬 3 (Slide 6)**: `snps-mcp/SKILL.md` (Synopsys 합성 및 STA 타이밍 분석 MCP 도구 연동).
7. **Harness Engineering (Slide 7)**: 컨텍스트(PDK/SDC), 도구(`jedai_*`, `siemens_*`, `snps_*`), 권한(라이선스/수정 승인), 오프라인/폐쇄망 보장.
8. **2단계 Agent (Slide 8)**: `dolsoe.md` (설계 페이즈별 MCP 자동 라우팅).
9. **Flow와 Loop (Slide 9)**: EDA Flow (합성 → 검증 → 분석) & Timing Closure Loop.
10. **Loop 스크립트 (Slide 10)**: `scripts/run_snps.sh` (STA Slack 수렴할 때까지 LLM 기반 튜닝 Loop).
11. **Loop 프롬프트 (Slide 11)**: `@dolsoe` DRC/Slack 수렴 지시문.
12. **3단계 마름 (Slide 12)**: `maleum.md` (합성/PPA 담당 돌쇠 & 물리검증/분석 담당 개똥이 지휘).
13. **4단계 언년이 (Slide 13)**: `eonnyeon.md` (DRC 0건 & Setup Slack >= 0ps Sign-off 판정).
14. **Graph 전체 지도 (Slide 14)**: EDA MCP 전체 상태 전이 SVG (마름 → 돌쇠/개똥이 → 언년이 → Tapeout PASS / 재배정 FAIL Loop).
15. **Local Checklist (Slide 15)**: 사내 로컬 EDA 환경 구성 5단계.
16. **방법론 지도 (Slide 16)**: 반도체 EDA AI 에이전트 7대 방법론.
17. **5단계 마을 게시판 (Slide 17)**: `agent-card.json` (EDA MCP 지원 능력 명시).
18. **6단계 Spec-Driven (Slide 18)**: `AGENTS.md`, `specs/001-timing-closure.md`, `docs/adr/`.
19. **7단계 돌쇠의 도서관 (Slide 19)**: `library/` (PDK 문서, EDA 툴 매뉴얼, DRC 룰덱 RAG/Wiki).
20. **Beyond (Slide 20)**: EDA MCP 표준, Tapeout HITL, 라이선스 샌드박싱.
