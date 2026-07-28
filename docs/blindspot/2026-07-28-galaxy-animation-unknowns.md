# 마우스 반응형 은하수 배경 애니메이션 Unknown Unknowns

- 날짜: 2026-07-28
- 입력: [2026-07-28-galaxy-animation-requirements.md](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-galaxy-animation-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | `index.html:31` | 기존에 있던 정적 배경(별 장식) 요소를 유지할 것인가, 아니면 캔버스로 완전히 교체할 것인가? | HTML 문서가 무거워지는 것을 막기 위해 기존 장식 컨테이너를 새로운 캔버스로 완전히 교체함. | 자체 해소 |
| 2 | `CLAUDE.md:24` | 외부 접속 없이 동작하도록 캔버스 스크립트 파일을 어디에 두고 어떻게 연결할 것인가? | `scripts/galaxy.js` 파일을 새로 만들고, 각 슬라이드 파일에서는 이 파일을 상대 경로로 수동 주입함. | 자체 해소 |
| 3 | https://vertexaisearch.cloud.google.com/grounding-api-redirect/... (로그 나선) | 수학 공식을 그릴 때 은하수의 나선 팔을 몇 개로 하고 모양을 어떻게 잡을 것인가? | 자연스러운 모습을 위해 로그 나선 공식을 사용하고 은하 팔의 개수를 3개로 고정함. | 자체 해소 |
| 4 | https://vertexaisearch.cloud.google.com/grounding-api-redirect/... (이벤트 폭주 랙) | 1초에 수백 번씩 위치가 변하는 마우스 신호를 애니메이션에 어떻게 끊김 없이 부드럽게 반영할 것인가? | 은하의 중심점 자체만 마우스를 부드럽게 따라다니게(선형 보간) 만들고, 입자들은 그 중심을 돌게 함. | 자체 해소 |
| 5 | https://vertexaisearch.cloud.google.com/grounding-api-redirect/... (모션 축소) | 사용자가 어지럼증 방지를 켜서 애니메이션이 멈출 때, 화면을 검게 비울 것인가 아니면 정지된 그림을 남길 것인가? | 멈춰 있더라도 배경이 비어 보이지 않도록 가장 처음 그려진 은하수 프레임 한 장만 띄워둔 채로 중지함. | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|

## 스캔 원본 요약

### conventions
- **[F1] 장식용 배경 레이어의 HTML 구조**: 기존 배경(`.stars`, `.deck-stars`)은 `aria-hidden="true"`와 고정된 CSS로 본문 컨텐츠 뒤에 렌더링됨. 새 캔버스 요소 주입 시 기존 래퍼를 대체할지 추가할지 결정이 필요함.
- **[F2] 외부 종속성 금지 및 공통 스크립트 주입 방식**: 오프라인 동작을 위해 외부 CDN을 금지하고 있으므로, `galaxy.js`와 같은 별도 파일을 저장소 내에 두고 각 슬라이드에서 상대 경로로 수동 삽입해야 함.
- **[F3] 모션 저감(어지럼증 방지) 설정 대응 관례**: CSS 미디어 쿼리 방식과 일관되게, JS 내에서도 `window.matchMedia('(prefers-reduced-motion: reduce)')`를 감지해 애니메이션을 강제 중지하도록 구현해야 함.

### similar-features
- 기존 슬라이드의 `.deck-stars` 및 애니메이션 방식 점검. (통합 완료)

### integration-points
- 모든 `slides/*/index.html`과 메인 `index.html` 총 4~5개 파일에 수동으로 캔버스 컨테이너와 스크립트 태그를 주입해야 함.

### edge-cases
- 접근성과 프린트 시 배경이 겹치는 현상 방어를 위해 미디어 쿼리 대응 필수.

### domain
- **[D1] 자연스러운 은하 팔(Arms) 형태의 수학적 분배**: 입자를 분배할 때 아르키메데스 나선이 아닌 '로그 나선'을 사용해야 자연스러운 은하 형상이 됨.
- **[D2] 30fps 최적화 및 타이머 누적 오차 보정**: `requestAnimationFrame` 내에서 `delta` 값을 통해 프레임 밀림을 방어해야 함.
- **[D3] 마우스 이벤트 폭주로 인한 캔버스 랙(Lag) 예방 패턴**: 마우스 이벤트에서는 좌표 변수만 버퍼링하고 연산은 루프 안에서 비동기로 처리해야 성능 저하를 막을 수 있음.
- **[D4] 프레임 독립적인 선형 보간(Time-based Lerp)**: 애니메이션 속도가 기기에 따라 변하지 않도록 시간 기반 Lerp 사용이 필수적임.
- **[D5] 모션 축소(Reduced Motion)의 올바른 처리 방식**: 애니메이션 중지 시 첫 프레임 한 장만 그리고 `cancelAnimationFrame`으로 루프를 즉시 차단하는 것이 모범적인 폴백임.
