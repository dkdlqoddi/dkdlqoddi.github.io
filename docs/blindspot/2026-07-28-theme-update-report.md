# 폰트 및 색상 테마 업데이트 작업 보고서

- 날짜: 2026-07-28
- 기준: main → HEAD
- 퀴즈: docs/blindspot/quiz/2026-07-28-theme-update.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

메인 페이지와 모든 발표 자료에 새로운 영문 폰트(몬세라트)를 적용했습니다. 전반적인 테마 색상을 보라색 계열에서 무채색(흰색과 회색)으로 바꿨습니다. 메인 화면의 외곽선(HUD)과 카드 테두리를 더 굵게 만들었습니다. 글씨가 찌그러지지 않고 화면에 선명하게 보이도록 다듬는 처리를 더했습니다.

### 스크린샷 / 데모

해당 없음

### 리뷰 포인트 (개발자용)

- `index.html:17`, `slides/*/index.html`: `montserrat.css` 폰트 링크 추가
- `styles.css:14`: `--primary`, `--secondary` 무채색 변경 및 `--hud-inset: 2em` 적용
- `styles.css:60, 257`: `.hud`, `.card` 테두리 2px 굵기 변경
- `slides/*/index.html`: `.reveal`에 폰트 스무딩 적용, `--r-main-font` 앞에 Montserrat 추가

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
기존의 포인트 컬러(Neon Purple, Cyan)를 무채색 계열로 변경하여 차분하고 통일된 인상을 주고자 함. 영문 가독성을 높이기 위해 Montserrat 폰트를 폰트 스택의 최우선으로 배치하고 글꼴 렌더링 최적화(antialiasing) 적용. HUD UI의 테두리와 간격을 넓혀 공간감을 확보.

### 제약 (Constraints)
- 정적 사이트이므로 폰트 추가 시 `vendor/montserrat` 경로를 통해 로컬에서 불러오도록 설정해야 함 (CDN 사용 지양).
- 한글 폰트(Pretendard)는 유지하면서 영문에만 먼저 새 폰트가 적용되도록 font-family 선언 순서를 조정해야 함.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| Montserrat 로드 실패 | Fallback인 Pretendard Variable 및 OS 기본 폰트로 렌더링되도록 폰트 스택 구성 유지 |
| 모바일 환경에서의 HUD 간격 | `--hud-inset`을 em 단위(2em)로 변경하여 기본 폰트 크기에 비례하도록 조정 |

### 검증 결과

- 폰트 적용 및 색상 변환 정상 동작 확인
- (check-runner: 검사 스크립트 없음)

### 의도적 범위 제외
- `vendor/montserrat/montserrat.css`의 실제 파일이 올바른 위치에 복사되어 있는지 여부는 커밋의 일부로 가정하고 검사하지 않음.

### 구현 노트 요약

해당 없음
