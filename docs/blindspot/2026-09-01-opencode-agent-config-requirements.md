# '나만의 돌쇠 AI 만들기' opencode.json Agent 등록 슬라이드 추가 요구사항 정의서

- 문서 ID: 2026-09-01-opencode-agent-config-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 날짜: 2026-09-01

## 1. 목적 및 배경
2단계 `dolsoe.md` 설명 슬라이드 바로 뒤에, 프로젝트 루트의 `opencode.json` 설정 파일에 에이전트를 등록하고 모델, 모드, 스킬 바인딩을 구성하는 방법을 설명하는 전용 슬라이드를 추가하여 에이전트 설정의 완결성을 높입니다.

## 2. 세부 요구사항

### 2.1 신규 슬라이드 구성 (Slide 9에 삽입, 총 21개 슬라이드로 확장)
- **위치**: Slide 8 (`2단계 · 때를 아는 Agent 만들기`) 직후
- **Eyebrow**: `AGENT CONFIG`
- **제목**: `2단계 · opencode.json에 Agent 등록하기`
- **소제목/설명**: "마크다운 지시문 외에도, `opencode.json`에서 에이전트의 모델, 모드, 사용할 스킬 목록을 중앙 집중식으로 정의할 수 있습니다."
- **도구 태그 배지**: `<span class="tag t-soft">CONFIG</span> <span class="tag t-hard">JSON</span> <span class="tag">OPENCODE.JSON</span>`
- **좌측 영역**: 컴팩트한 `opencode.json` 에이전트 설정 코드 블록 (8~10줄)
  ```json
  // opencode.json
  {
    "agent": {
      "dolsoe": {
        "description": "EDA 매뉴얼 리서치 일꾼",
        "mode": "primary",
        "model": "codemate/CodeLLMPro",
        "skills": ["fetch-jedai-manual", "fetch-siemens-manual", "fetch-snps-manual"]
      }
    }
  }
  ```
- **우측 영역**:
  - 패널 카드 1: **프로젝트 전역 Agent 등록** (팀원 모두가 공유하는 일관된 에이전트 설정)
  - 패널 카드 2: **skills 명시적 바인딩** (`skills` 배열로 허용 스킬을 한정하여 오동작 방지)
  - 패널 카드 3: **`.md` 지시문과의 역할 분담** (`.md`는 페르소나/프롬프트, `json`은 시스템/모델 인프라)

### 2.2 제약사항 및 품질 기준
- **No-Scroll 100% 준수**: 신규 슬라이드를 포함하여 21개 슬라이드 전체의 렌더링 높이가 450px 이하로 유지될 것.
- **템플릿 디자인 일치성**: 다크 스페이스 HUD 테마, 코드 복사 버튼, Pretendard 글꼴 완벽 연동.
- **오프라인 자기완결성**: 외부 CDN 0건 유지.
