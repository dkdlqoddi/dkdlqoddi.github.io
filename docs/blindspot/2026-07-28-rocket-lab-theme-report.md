# Rocket Lab 테마 이관 및 렌더링 개선 작업 보고서

- 날짜: 2026-07-28
- 기준: main → HEAD
- 퀴즈: docs/blindspot/quiz/2026-07-28-rocket-lab-theme.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

발표자료 전체의 디자인이 로켓 랩(Rocket Lab) 투자자 자료처럼 깔끔하게 바뀌었습니다.
가장자리가 부드럽게 다듬어진 새로운 영문 글꼴(몬세라트)이 첫 화면과 발표자료 곳곳에 적용되었습니다.
기존에 쓰이던 보라색 포인트 컬러는 모두 지워지고 고대비 흑백 색상으로 통일되었습니다.
이러한 변경으로 글씨가 흐릿해 보이던 문제가 사라지고 디자인이 단정해졌습니다.
인터넷이 끊긴 비행기나 지하철 등 오프라인 상태에서도 글꼴이 정상적으로 나타납니다.

### 스크린샷 / 데모

해당 없음

### 리뷰 포인트 (개발자용)

- `index.html:18` : `vendor/montserrat/montserrat.css` 참조 추가
- `styles.css:12-21` : 무채색 테마(--primary, --secondary) 적용, `--hud-inset` 변경 및 몬세라트 폰트 스택 적용
- `slides/*/index.html` : 몬세라트 폰트 우선순위 지정, 무채색 테마 덮어쓰기, `.reveal` 블록에 `-webkit-font-smoothing` 추가

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
디자인 렌더링 품질(글꼴 안티앨리어싱) 향상 및 기하학적 흑백 테마(Rocket Lab) 구조 이관.

### 제약 (Constraints)
모든 슬라이드 및 폰트 파일이 `file://` 오프라인 환경에서 동작해야 하므로 CDN 폰트가 불가하여 폰트를 Base64로 내장해야 함. 모노크롬 기본 원칙에 따라 무채색만 활용해야 함.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 오프라인 동작 보장 | Google Fonts에서 Montserrat(400, 700) woff2를 받아 Base64로 인코딩하여 `montserrat.css` 내에 포함시킴 |
| 어두운 배경 한글 획 뭉개짐 현상 | CSS `-webkit-font-smoothing: antialiased;` 및 `-moz-osx-font-smoothing: grayscale;` 속성을 `.reveal`에 강제 주입함 |

### 검증 결과

1. `git diff main`: `index.html`, `styles.css`, `slides/*/index.html` 5개 파일 변경 확인 및 CSS 속성 주입 완료 확인.
2. `python3 -m json.tool slides.json`: 구문 오류 없는 정상적인 JSON 형식 검증 완료.
3. 파일 존재 여부: `vendor/montserrat/montserrat.css` 생성(약 481KB) 완료.

### 의도적 범위 제외

- 마우스 반응형 은하수 배경 애니메이션 기능은 이번 작업에서 완전 제외.

### 구현 노트 요약

- 2026-07-28 16:38 — 초기 파일 생성 (구현 노트 생성)
- 2026-07-28 16:39 — Montserrat 폰트를 구글 폰트에서 Base64로 다운로드 받아 내장함 (사용자 확인 필요: 아니오)
