# dkdlqoddi.github.io — 발표 기록

AI와 자동화에 관한 발표·실습 자료를 모은 GitHub Pages 사이트입니다.
`main`에 push하면 https://dkdlqoddi.github.io 에 배포됩니다.

## 공통 Template

전체 발표자료와 sample은 **웜 그레이 종이 배경, 차분한 파스텔, 잉크색 윤곽선과 그림자**의 카툰 스타일을 공유합니다. 발표·읽기·PDF와 내려받는 실습 자료에 같은 팔레트를 적용합니다. 메인은 기존 장식 Galaxy와 최신순 카드 목록으로 구성됩니다.

- `assets/theme.css`: 색상, Pretendard 글꼴, 버튼, 상단바, 동작 축소와 페이지 전환.
- `assets/template.js`: 메인·발표·404에서 사용하는 상단바. 스크립트 위치로 홈 주소를 계산하므로 중첩 URL과 `file://`에서도 사용할 수 있습니다.
- `slides/shared/deck-base.css`: 발표 화면, 읽기 화면, 목차, 이동 버튼, 카드·도식 컴포넌트, 인쇄 스타일.
- `slides/shared/cartoon-deck.css`: 발표 전용 팔레트와 카툰 표현. `<html class="cartoon-theme">`에서 적용하며 덱 고유 스타일 뒤에 불러옵니다. 독립 실습 HTML의 인라인 팔레트도 함께 유지합니다.
- `slides/shared/deck-template.js`: 공통 발표 셸, Reveal 초기화, 목차·키보드·프래그먼트 이동, 읽기/발표 전환, 메모, 전체화면, 인쇄.
- `slides/shared/legacy-deck.css`: 기존 960×700 덱의 배치 어댑터. 최신 덱은 1280×720입니다.
- `slides/agent-tools-antigravity/course.js`: 해당 수업의 퀴즈·복사·실습 버튼만 담당합니다.

좁은 화면은 읽기 모드로 표시하고, 넓은 도표는 도표 영역에서 가로로 스크롤할 수 있습니다. 인쇄는 덱 전체를 한 장당 한 쪽으로 출력하고 발표 화면으로 복귀합니다. Galaxy는 `scripts/galaxy.js`와 CSS로 동작하며 일시정지, 화면 밖·백그라운드 정지, 시스템 동작 축소 설정을 지원합니다.

## 새 발표자료 추가

1. `slides/sample/`을 새 폴더로 복사합니다. 폴더 이름은 영문 소문자·하이픈을 사용합니다. 이 이름이 공개 URL입니다. `sample`은 복사용 원본이므로 목록에 등록하지 않습니다.
2. `index.html`의 제목과 `<section>` 내용을 수정합니다. 공통 CSS와 JS 연결을 유지하고 덱 고유 스타일만 추가합니다. 별도의 `Reveal.initialize()` 호출은 필요 없습니다. `<section id="intro" data-title="소개" data-chapter="시작">`처럼 지정하면 목차와 공유 주소에 사용합니다. 생략하면 순서와 제목에서 자동 생성합니다.
3. 루트 `slides.json`에 등록합니다:
   ```json
   { "title": "발표 제목", "date": "2026-09-21", "description": "한 줄 설명", "dir": "my-talk" }
   ```
4. 로컬 검증 후 PR 리뷰를 거쳐 `main`에 반영합니다.

CSS 순서는 Reveal의 `white.css` → `assets/theme.css` → `deck-base.css` → 필요한 경우 `legacy-deck.css` → 덱 고유 스타일 → `cartoon-deck.css`입니다. JS 순서는 Reveal → `assets/template.js` → `deck-template.js` → 덱별 실습 코드입니다.

## 로컬 미리보기와 검증

```bash
python3 -m http.server 8000
# http://localhost:8000
```

덱 하나는 `slides/<폴더>/index.html`을 직접 열어도 됩니다. 메인 목록은 HTTP 서버에서 확인합니다. 발표의 `?view=read`는 읽기 화면, `?view=slides`는 발표 화면, `?view=print` 또는 `?print-pdf`는 인쇄 화면입니다. 이전의 `#/2` 같은 슬라이드 주소도 지원합니다.

```bash
python3 scripts/verify_deck.py
```

실제 브라우저 검증에는 Playwright와 Chrome이 필요합니다. 사이트에는 빌드나 npm 의존성을 추가하지 않습니다. 위 HTTP 서버를 실행한 상태에서:

```bash
npm install --prefix /tmp/presentation-check playwright
NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_theme.cjs
```

필요하면 `CHROME_PATH`, `SITE_URL`, `ARTIFACT_DIR` 환경변수를 지정합니다. 검증은 전체 덱의 배경 밝기·본문 대비, 탐색·목차·읽기 화면·모바일·오프라인·PDF, 프래그먼트, 최신 덱 실습, Galaxy 동작 축소·정지, 목록 오류와 404를 확인합니다. 스크린샷과 PDF는 기본 `/tmp/presentation-theme-check/`에 저장합니다.

## 파일과 자산

`vendor/reveal.js/`는 Reveal 6.0.1, `vendor/pretendard/`는 글꼴을 동봉합니다. `vendor/three.js/`와 `vendor/montserrat/`는 과거 자료용 자산으로 보관하며 현재 공통 템플릿에서는 불러오지 않습니다. 라이브러리나 글꼴을 CDN에서 불러오지 마세요.

404는 임의 깊이 URL에서도 공통 테마를 읽도록 루트 경로를 사용하며 자산을 읽지 못해도 기본 안내가 표시됩니다. `practice-result.html`은 공통 테마를 연결하되 단일 파일로 내려받아도 인라인 스타일만으로 열립니다.

- `.nojekyll`을 삭제하면 Jekyll이 Reveal 파일의 `{{ }}`를 해석할 수 있으므로 유지합니다.
- 서브모듈은 공개 저장소와 HTTPS URL을 유지합니다.
- 동봉 글꼴 데이터와 라이선스는 수정하거나 서브셋하지 않습니다.
- Reveal 플러그인은 동봉되어 있지 않습니다. 순수 HTML을 사용하고, 진행 메모는 공통 셸의 `<aside class="notes">`를 사용합니다.
- 확대 금지 옵션을 추가하지 않습니다. 도표에는 `role="img"`와 설명을 제공하고 `currentColor` 또는 공통 색상 토큰을 사용합니다.
- 프래그먼트와 모핑의 견본은 `sample`의 마지막 보너스 두 장에 있습니다. 동작 축소와 인쇄에서도 확인하세요.
- 결정은 `docs/decisions.md`에 한 줄씩 추가합니다. 이 작업 흐름으로 다른 `docs/` 문서를 만들지 않습니다. 머지 게이트는 PR 리뷰입니다.
