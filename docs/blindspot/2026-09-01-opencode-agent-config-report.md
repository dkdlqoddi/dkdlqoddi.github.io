# '나만의 돌쇠 AI 만들기' opencode.json Agent 등록 슬라이드 추가 작업 보고서

- 날짜: 2026-09-01
- 대상: `slides/my-dolsoe-ai/index.html`
- 퀴즈: `docs/blindspot/quiz/2026-09-01-opencode-agent-config.html` — 통과 확인 필수

## Human 섹션

### 요약
2단계 `dolsoe.md` 설명 직후에 `opencode.json` 파일에 Agent를 정의하고 모델/모드/스킬 바인딩을 프로젝트 전역에서 중앙 집중식으로 선언하는 방법을 설명하는 **신규 Slide 9 (`2단계 · opencode.json에 Agent 등록하기`)**를 추가했습니다 (총 슬라이드 수: 21개).
1. **신규 Slide 9 내용**:
   - `opencode.json`의 `"agent": { "dolsoe": { ... } }` 구조 예시 제시.
   - 프로젝트 전역 Agent 등록, `skills` 명시적 바인딩을 통한 도구 오용 방지, `.md`(행동 프롬프트)와 `json`(시스템 설정)의 역할 분담 설명.
   - 도구 태그 배지 (`CONFIG`, `JSON`, `OPENCODE.JSON`) 배치로 템플릿 UI 일관성 유지.
2. **품질 및 No-Scroll 검증**:
   - 신규 슬라이드 렌더링 높이 ~360px로 컴팩트하게 구성하여 21개 슬라이드 전체에서 세로 스크롤 0건 완벽 보장.
   - `python scripts/verify_deck.py` 통과 (21개 섹션, 6개 SVG 접근성 무결성).

### 확인 장면 및 미리보기
- 로컬 웹 서버: `python -m http.server 8000`
- 발표자료: `http://localhost:8000/slides/my-dolsoe-ai/#/8` (신규 슬라이드 9)

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
사용자의 요청에 따라 2단계 `dolsoe.md` 설명 바로 뒤에 `opencode.json`에 에이전트를 선언하는 방법을 설명하는 슬라이드를 추가하여 에이전트 설정 메커니즘을 완성함.

### 제약 (Constraints)
- 공유 CSS 불변 유지, 외부 자산 0건.
- 21개 전 슬라이드 No-Scroll 유지.

### 검증 결과
- `python scripts/verify_deck.py` 통과.
