# cds-agentic-architecture Unknown Unknowns

- 날짜: 2026-07-28
- 입력: [2026-07-28-cds-agentic-architecture-requirements.md](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-cds-agentic-architecture-requirements.md)
- 스캔 렌즈: conventions / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | `slides.json` 렌더링 의존성 (`slides.json:1`) | 새 발표자료를 목록에 어떻게 노출시킬 것인가? | `slides.json`에 `title`, `date`, `description`을 포함한 완전한 JSON 객체를 추가합니다. | 자체 해소 |
| 2 | 에셋 상대경로 및 초기 테마 (`slides/sample/index.html:12-25`) | 오프라인과 다크 테마에서 화면이 깨지지 않게 하려면 어떻게 해야 하는가? | 외부 CDN 없이 `vendor` 상대경로를 쓰고, HTML 최상단에 다크 모드를 선언합니다. | 자체 해소 |
| 3 | `.steps` 알약 UI 컴포넌트 병합 (`slides/cds-agentic-work/index.html:199-207`) | 담당자 작업을 표현할 가로 알약 UI를 어떻게 확보할 것인가? | `cds-agentic-work` 데크에 있는 `.steps` 전용 CSS를 새 발표자료의 `<style>`에 복사하여 이식합니다. | 자체 해소 |
| 4 | 다이어그램 접근성 규칙 (`slides/sample/index.html:250-252`) | 시각장애인용 스크린 리더가 다이어그램 흐름을 읽게 하려면 어떻게 해야 하는가? | 다이어그램 직전에 `<p class="visually-hidden">`으로 전체 구조를 글로 설명합니다. | 자체 해소 |
| 5 | 모핑 애니메이션 방어 로직 (`slides/cds-agentic-work/index.html:158-188`) | 애니메이션 좌표 틀어짐이나 인쇄 시 잉크 소실을 어떻게 막을 것인가? | `transform-box` 지정 및 인쇄용 `!important` 색상 복원 CSS를 수동 추가합니다. | 자체 해소 |
| 6 | 발표 내용: `newgrp` 서브셸 함정 소개 (모델 지식) | 발표 슬라이드 내에서 스크립트 권한 부여 방식을 어떻게 안내할 것인가? | 슬라이드 본문에 "`sg` 명령어를 사용하여 단일 작업에 권한을 부여한다"고 기재합니다 (실제 구현 아님). | 사용자 |
| 7 | 발표 내용: Perforce 충돌 (모델 지식) | 발표 슬라이드 내에서 병렬 에이전트 간 덮어쓰기 방지책을 어떻게 안내할 것인가? | 슬라이드 본문에 "기존 P4CONFIG 환경 존중으로 충돌 위험 감수"라고 기재합니다 (실제 구현 아님). | 사용자 |
| 8 | 발표 내용: 라이선스 에러 분기 (모델 지식) | 발표 슬라이드 내에서 라이선스 에러 처리 방침을 어떻게 안내할 것인가? | 슬라이드 본문에 "-4 코드는 큐 대기, -15 및 기타 알 수 없는 에러는 즉시 리포트로 분기 처리한다"고 기재합니다 (실제 구현 아님). | 사용자 |
| 9 | 발표 내용: 검증 결과 분기 (모델 지식) | 발표 슬라이드 내에서 검증 에러 자동 수정 가이드를 어떻게 안내할 것인가? | 슬라이드 본문에 "Off-grid, Spacing 등의 사전 정의된 단순 위반만 자동 수정하고, 나머지는 즉시 중단 및 오너 승인 대기"라고 기재합니다 (실제 구현 아님). | 사용자 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| - | 없음 | 모든 항목이 결정되었습니다. | - |

## 스캔 원본 요약

### conventions
로컬 에셋 상대경로 참조 및 JS 로드 전 다크모드 선언 규칙 확인. 인쇄 및 애니메이션 끄기 설정에 대응하는 CSS 계층 확인.

### integration-points
발표자료 매니페스트(`slides.json`) 등록 필요성. `.steps` 알약 컴포넌트를 이 덱의 CSS에 이식해야 함. SVG 태그 및 `visually-hidden` 스크린 리더 텍스트 조합 준수 필요.

### edge-cases
SVG `fragment` 적용 시 `transform-origin` 보정 필수. Auto-animate에서 새로 추가된 요소의 페이드 충돌 방지 속성(`data-auto-animate-unmatched="false"`) 필요. 인쇄 모드 진입 시 `!important`로 모핑 CSS 찌꺼기 방어 필수.

### domain
`newgrp` 사용 시 발생하는 에이전트 멈춤 현상 위험성. VWP 상 Perforce `P4CLIENT` 공유로 인한 병렬 덮어쓰기 위험. 라이선스(FlexLM) 장애와 용량 한계를 구분하여 처리해야 하는 당위성 도출. 이들은 코드 구현이 아니라 발표 슬라이드 텍스트에 포함될 설명 항목들임.
