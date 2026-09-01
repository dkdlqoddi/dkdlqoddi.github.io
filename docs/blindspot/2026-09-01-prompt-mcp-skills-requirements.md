# '나만의 돌쇠 AI 만들기' 프롬프트 기반 MCP 직접 호출 개편 요구사항 정의서

- 문서 ID: 2026-09-01-prompt-mcp-skills-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 날짜: 2026-09-01

## 1. 목적 및 배경
OpenCode에 이미 `jedai`, `Siemens_MCP`, `SNPS_MCP` 등 3대 EDA MCP가 네이티브로 연결되어 있으므로, 불필요한 중간 쉘 스크립트(`scripts/`) 계층을 완전히 제거하고 **에이전트가 프롬프트를 통해 연결된 MCP 도구를 직접 호출하는 방식**으로 전체 슬라이드와 스킬 절차를 개편합니다.

## 2. 세부 요구사항

### 2.1 1단계 스킬 절차의 프롬프트/MCP 직접 호출화
1. **`fetch-jedai-manual` (Slide 4)**:
   - 별도 쉘 스크립트 실행 단계 제거.
   - 절차: OpenCode에 연결된 `jedai` MCP 도구를 프롬프트로 직접 호출하여 최근 30일 내 매뉴얼을 조회하고 `data/jedai_manual.md`에 저장.
2. **`fetch-siemens-manual` (Slide 5)**:
   - 절차: 연결된 `Siemens_MCP` 도구를 프롬프트로 직접 호출하여 Calibre DRC/LVS 매뉴얼을 조회하고 `data/siemens_manual.md`에 저장.
3. **`fetch-snps-manual` (Slide 6)**:
   - 절차: 연결된 `SNPS_MCP` 도구를 프롬프트로 직접 호출하여 Design Compiler/PrimeTime 매뉴얼을 조회하고 `data/snps_manual.md`에 저장.

### 2.2 2단계 이후 전체 파이프라인 동기화
1. **Slide 3 (디렉터리 레이아웃)**: 불필요한 `scripts/` 디렉터리를 제거하고 `opencode.json`의 MCP 서버 등록 설정과 `.opencode/skills/`, `.opencode/agents/` 중심 구조로 간소화.
2. **Slide 7 (Harness)**: OpenCode와 MCP 간의 네이티브 도구 바인딩 및 프롬프트 제약 설정.
3. **Slide 8 (Agent `@dolsoe`)**: 연결된 MCP 목록을 확인하고 알맞은 스킬을 프롬프트로 호출하는 에이전트.
4. **Slide 9~11 (Flow & Loop)**: 스크립트 없이 프롬프트로 MCP를 직접 호출하고, 미완결 시 프롬프트 질의를 조정하며 MCP를 되풀이 호출하는 Flow/Loop.
5. **Slide 12~14 (마름, 언년이, Graph)**: 중간 스크립트 계층이 제거되어 `Agent → Prompt → MCP Tool`로 직결되는 명료한 아키텍처 반영.
6. **Slide 15 (Checklist)**: 02단계에서 `opencode.json`에 MCP 서버 등록(jedai, Siemens_MCP, SNPS_MCP) 강조.

### 2.3 제약사항
- 960×700 캔버스 예산 내 **No-Scroll 레이아웃** 100% 유지.
- 템플릿 코드 복사 버튼 동작 및 다크 스페이스 HUD 테마 보존.
- 오프라인 자기완결성 및 접근성 규약 준수.
