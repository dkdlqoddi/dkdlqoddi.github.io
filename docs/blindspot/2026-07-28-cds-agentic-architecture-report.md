# cds-agentic-architecture 작업 보고서

- 날짜: 2026-07-28
- 기준: origin/main → HEAD
- 퀴즈: docs/blindspot/quiz/2026-07-28-cds-agentic-architecture.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

반도체 설계 업무를 인공지능 에이전트와 함께 수행하기 위한 전체 시스템 구조를 정리했습니다. 새로 추가된 발표자료는 오픈코드에서 시작해 중개 서버를 거쳐 가상 작업망까지 도달하는 연결 과정을 순서대로 보여줍니다. 또한 담당자들이 에이전트를 위해 설정해야 할 툴 설정값 정의, 멈춤을 방지하는 권한 제어 스크립트, 로그를 보고 성공 여부를 판단하는 기준의 세 가지 필수 작업을 명확히 안내합니다.

### 스크린샷 / 데모

해당 없음 (새 발표자료 접속 주소: `https://dkdlqoddi.github.io/slides/cds-agentic-architecture/`)

### 리뷰 포인트 (개발자용)

- `slides/cds-agentic-architecture/index.html:26-181`: `.steps` CSS 및 다크 테마/인쇄 방어용 인라인 스타일이 누락 없이 이식되었는지 확인
- `slides/cds-agentic-architecture/index.html:183-294`: SVG 다이어그램 내부 `data-auto-animate` 모핑 로직 및 접근성(`visually-hidden`) 텍스트 구현
- `slides.json:7-12`: 새 데크 엔트리가 유효한 JSON 형식으로 등록되었는지 확인

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
VWP 내 에이전트 연동을 위한 도메인 오너 협조 요구사항을 시각화된 프레젠테이션으로 전달합니다. Reveal.js의 `data-auto-animate` SVG 모핑을 통해 정보 과부하 없이 인프라 아키텍처(Opencode-API-MCP-VWP)를 순차적으로 전개합니다.

### 제약 (Constraints)
모든 애니메이션 및 도형 렌더링은 외부 인터넷 연결이 없는 오프라인 환경과 종이 인쇄 시나리오에서도 내용 유실이 없도록 내장 CSS/SVG 및 `currentColor` 속성만을 이용해야 합니다.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 인쇄 모드 진입 시 모핑 CSS 우선순위에 밀려 도형 사라짐 | `!important`가 선언된 `@media print` 흑백 색상 복원 규칙 추가 |
| 화면 낭독기 환경에서 시각 다이어그램 정보 단절 | 각 SVG 요소 직전에 `visually-hidden` 클래스를 사용해 다이어그램 흐름을 대체 서술 |

### 검증 결과
`python -m json.tool slides.json` 구문 검사 정상 통과. 추가된 `dir` 속성과 `slides/cds-agentic-architecture` 디렉터리 경로의 1:1 매칭 수동 확인 완료.

### 의도적 범위 제외
실제 VWP 망 권한 체계 연동 스크립트 및 MCP 서버 백엔드 설정값 반영 등 발표자료 저장소의 목적을 벗어나는 모든 인프라 로직 구현을 배제했습니다.

### 구현 노트 요약
- 결정: `cds-agentic-work` 데크에서 사용된 `.steps` 공용 알약 UI CSS를 이 덱의 내장 `<style>`로 복사하여 독립적으로 이식 (보수적 선택: 글로벌 CSS 파일로의 추출 및 의존성 파편화 회피). 계획 이탈 없음. 사용자 확인 필요 사항 없음.
