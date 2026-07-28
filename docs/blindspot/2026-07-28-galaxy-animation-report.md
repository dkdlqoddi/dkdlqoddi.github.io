# 은하수 배경 애니메이션 작업 보고서

- 날짜: 2026-07-28
- 기준: main → HEAD
- 퀴즈: docs/blindspot/quiz/2026-07-28-galaxy-animation.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

랜딩 페이지와 모든 발표자료 슬라이드의 배경에 마우스 움직임을 따라다니는 화려한 은하수 애니메이션을 새로 추가했습니다.
배터리 소모를 막기 위해 프레임 속도와 화면 입자 수를 조절했으며, 여러 화면에서 코드가 중복되지 않도록 하나의 공통 파일을 만들어 연결했습니다.
또한 사용자가 기기 설정에서 어지럼증 방지를 켜 둔 경우, 애니메이션이 즉시 정지하고 첫 화면에서 멈춰있게 됩니다.

### 스크린샷 / 데모

해당 없음

### 리뷰 포인트 (개발자용)

- `scripts/galaxy.js` : 신규 캔버스 렌더링 로직 (로그 나선 공식, 30fps 스로틀링, 시간 기반 선형 보간, 모션 축소 감지)
- `index.html` : 기존 `<div class="stars">` 대신 `<canvas class="galaxy-bg">` 주입 및 스크립트 로드
- `slides/*/index.html` : 기존 `<div class="deck-stars">` 대신 캔버스 주입 및 스크립트 로드
- `styles.css` : `.stars` 애니메이션 제거 및 `.galaxy-bg` 고정 스타일 지정

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
디자인 개편 시 보류되었던 마우스 반응형 우주(Galaxy) 배경 파티클 애니메이션을 캔버스(Canvas) 기반으로 구현.

### 제약 (Constraints)
순수 오프라인 `file://` 구동을 보장하기 위해 CDN 없이 로컬 `scripts/galaxy.js` 참조. 기존 아키텍처의 CSS 애니메이션 강제 정지(모션 축소) 규칙을 JS `requestAnimationFrame` 내에서도 동일하게 보장.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 마우스 이벤트로 인한 메인 스레드 랙 | `mousemove`에서는 좌표 갱신만 수행하고, 실제 보간(Lerp) 연산과 렌더링 루프를 분리(디커플링)함 |
| 기기별 프레임 속도 차이에 따른 애니메이션 가속 문제 | 프레임 시간차(delta)를 기반으로 하는 시간 기반(Time-based) 선형 보간식을 적용 |
| 어지럼증 방지(prefers-reduced-motion) 환경 | `window.matchMedia`를 실시간으로 감지해 조건 충족 시 `cancelAnimationFrame`으로 루프를 즉시 중단시킴 |

### 검증 결과

- `slides.json` 린트(json.tool) 통과.
- `index.html`, `styles.css` 및 모든 하위 `slides/*/index.html` 문서 정규식 패치 및 `<canvas class="galaxy-bg">` 적용 완료 확인.

### 의도적 범위 제외

- 외부 수학 라이브러리(Three.js 등) 사용 배제 (순수 바닐라 2D Canvas Context 연산만 사용).

### 구현 노트 요약

- 기존 CSS 기반의 배경 컨테이너(`.stars`, `.deck-stars`)는 마운트 충돌 방지를 위해 전부 삭제하고 `.galaxy-bg`로 일원화함.
- `galaxy.js`는 `DOMContentLoaded`를 기다리지 않도록 즉시 실행 함수(IIFE)로 작성되고 HTML 하단에서 `defer`로 로드되게 함.
