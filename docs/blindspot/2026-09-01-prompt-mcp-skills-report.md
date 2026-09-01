# '나만의 돌쇠 AI 만들기' 프롬프트 기반 MCP 직접 호출 개편 작업 보고서

- 날짜: 2026-09-01
- 대상: `slides/my-dolsoe-ai/index.html`, `slides.json`
- 퀴즈: `docs/blindspot/quiz/2026-09-01-prompt-mcp-skills.html` — 통과 확인 필수

## Human 섹션

### 요약
OpenCode에 이미 `jedai`, `Siemens_MCP`, `SNPS_MCP`가 네이티브 연결되어 있는 환경을 반영하여, 불필요한 중간 쉘 스크립트(`scripts/`)를 제거하고 **프롬프트로 연결된 MCP 도구를 직접 호출하는 방식**으로 20개 슬라이드 전체를 간결하고 직관적으로 개편했습니다.
1. **디렉터리 레이아웃 간소화 (Slide 3)**:
   - `scripts/` 제거 &rarr; `opencode.json` (MCP 서버 등록) + `.opencode/skills/` + `.opencode/agents/` 중심 구조
2. **1단계 스킬 3종 프롬프트 직접 호출 절차화 (Slide 4~6)**:
   - `fetch-jedai-manual`: 프롬프트로 연결된 `jedai` MCP 도구 직접 호출
   - `fetch-siemens-manual`: 프롬프트로 연결된 `Siemens_MCP` 도구 직접 호출
   - `fetch-snps-manual`: 프롬프트로 연결된 `SNPS_MCP` 도구 직접 호출
3. **2단계 이후 파이프라인 동기화 (Slide 7~15)**:
   - Agent, Flow & Loop, 마름, 언년이, 전체 Graph SVG 모두 `Agent → Prompt → MCP Tool`로 직결되는 아키텍처로 개편
4. **No-Scroll 레이아웃 유지**: 20개 슬라이드 전체 960×700 뷰포트 내 스크롤 0건 완결 표출.

### 확인 장면 및 미리보기
- 로컬 웹 서버: `python -m http.server 8000`
- 발표자료: `http://localhost:8000/slides/my-dolsoe-ai/`

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
"mcp들은 이미 opencode에 연결되어 있으므로, script를 따로 사용하는게 아니라 prompt로 mcp를 호출하는 방식으로 수정" 요청에 따라 스크립트 의존성을 완전히 제거하고 프롬프트 기반 네이티브 MCP 호출 아키텍처로 전면 정돈함.

### 제약 (Constraints)
- 공유 파일(`deck-base.css` 등) 불변 유지.
- 템플릿 코드 복사 버튼 기능 및 20개 슬라이드 전체의 No-Scroll 높이 예산 준수.
- 0개 CDN 의존성 및 SVG 접근성 규약 100% 만족.

### 검증 결과
- `python scripts/verify_deck.py` 통과 (20개 섹션, 6개 SVG 접근성, 5개 덱 링크 무결성).
