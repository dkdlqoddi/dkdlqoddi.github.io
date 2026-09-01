# '나만의 돌쇠 AI 만들기' 프롬프트 기반 MCP 직접 호출 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 슬라이드별 프롬프트 기반 MCP 직접 호출 개편 매핑

1. **표지 (Slide 1)**: "OpenCode에 연결된 JedAI · Siemens · SNPS MCP를 프롬프트로 부리는 스마트 일꾼 돌쇠".
2. **비유 체계 (Slide 2)**:
   - Skill: 프롬프트로 연결된 MCP를 호출해 최신 매뉴얼을 읽어오는 일 단위
   - Agent: 어떤 툴의 MCP를 부를지 프롬프트 지시문으로 판단하는 돌쇠
   - Orchestrator: 3대 MCP를 다루는 일꾼들을 지휘하는 마름
   - Harness: OpenCode의 MCP 서버 바인딩 및 도구 권한 담장
   - Flow: 프롬프트 입력 &rarr; MCP 직접 호출 &rarr; 결과 파싱 &rarr; 지식 저장
   - Loop: 프롬프트 튜닝을 통해 원하는 매뉴얼 항목이 확보될 때까지 되풀이
   - Graph: 프롬프트와 MCP 도구가 직결된 전체 에이전트 상태 전이도
3. **디렉터리 레이아웃 (Slide 3)**:
   - `my-dolsoe/` 트리: `opencode.json` (MCP 설정) + `.opencode/skills/` + `.opencode/agents/` (scripts 폴더 제거)
   - 4대 규칙: `skills/` 복수형, `폴더명=name`, `agents/ 파일명=이름`, `MCP 직접 호출` (별도 스크립트 없이 프롬프트로 실행)
4. **1단계 스킬 1 (Slide 4)**: `fetch-jedai-manual/SKILL.md` (프롬프트로 `jedai` MCP 직접 호출).
5. **1단계 스킬 2 (Slide 5)**: `fetch-siemens-manual/SKILL.md` (프롬프트로 `Siemens_MCP` 직접 호출).
6. **1단계 스킬 3 (Slide 6)**: `fetch-snps-manual/SKILL.md` (프롬프트로 `SNPS_MCP` 직접 호출).
7. **Harness Engineering (Slide 7)**: `opencode.json`의 MCP 연결 설정 + 프롬프트 권한 제어.
8. **2단계 Agent (Slide 8)**: `dolsoe.md` (연결된 MCP 도구를 파악하고 알맞은 스킬을 프롬프트로 실행).
9. **Flow와 Loop (Slide 9)**: 프롬프트 기반 Flow & MCP 반복 호출 Loop.
10. **Loop 실행 (Slide 10)**: `opencode run` CLI 또는 세션에서 프롬프트로 MCP를 반복 호출하는 메커니즘.
11. **Loop 프롬프트 (Slide 11)**: `@dolsoe`에게 프롬프트로 MCP 반복 호출 지시.
12. **3단계 마름 (Slide 12)**: `maleum.md` (하인들에게 프롬프트로 MCP 실행을 지시하고 결과 통합).
13. **4단계 언년이 (Slide 13)**: `eonnyeon.md` (MCP 호출 결과 파일 검증).
14. **Graph 전체 지도 (Slide 14)**: 중간 스크립트 없이 `Agent → Prompt → MCP Tool`로 직결된 전체 SVG.
15. **Local Checklist (Slide 15)**: 02단계에서 `opencode.json`에 `mcpServers` 등록 명시.
16. **방법론 지도 (Slide 16)**: MCP 네이티브 도구 연동과 지식화.
17. **5단계 마을 게시판 (Slide 17)**: `agent-card.json` (연결된 MCP 도구 목록 명시).
18. **6단계 Spec-Driven (Slide 18)**: `AGENTS.md`, `specs/001-manual-sync.md`.
19. **7단계 돌쇠의 도서관 (Slide 19)**: `library/` (MCP로 수집한 지식 베이스).
20. **Beyond (Slide 20)**: OpenCode MCP 표준 생태계.
