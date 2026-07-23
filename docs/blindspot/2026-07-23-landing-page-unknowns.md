# 발표자료 랜딩 페이지 Unknown Unknowns

- 날짜: 2026-07-23
- 입력: [요구사항 문서](2026-07-23-landing-page-requirements.md)
- 스캔 렌즈: domain (코드 렌즈 3종은 저장소가 비어 있어 생략 — 유일한 저장소 특이점인 서브모듈 설정은 직접 확인)

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 브랜치 배포는 기본으로 Jekyll 빌드를 거침. JS/HTML 내 `{{ }}`·`{% %}` 리터럴이 Liquid로 해석되어 빌드 실패·내용 훼손 — reveal.js에서 빈발 (https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll, https://github.com/jekyll/jekyll/issues/6217) | 저장소 파일을 손대는 자동 변환기(Jekyll)를 끌 것인가? | 끈다. 저장소 루트에 빈 `.nojekyll` 파일을 둔다. | 자체 해소 |
| 2 | `.nojekyll` 시 닷 파일/디렉터리도 그대로 서빙됨 — `.claude/`, `docs/`가 URL로 접근 가능해짐. 단 저장소 자체가 이미 공개 (https://github.com/orgs/community/discussions/22227) | 내부 폴더가 웹 주소로도 열리는 것을 받아들일 것인가? | 받아들인다. 이미 공개 저장소라 새로 노출되는 비밀이 없다. | 자체 해소 |
| 3 | 서브모듈 `.claude/shared`는 HTTPS 공개 URL(.gitmodules:3). Pages는 공개+HTTPS 서브모듈만 처리하며, private/SSH 전환 시 배포 전체 실패. `.nojekyll`과 무관하게 체크아웃 단계에서 수행 (https://docs.github.com/en/pages/getting-started-with-github-pages/using-submodules-with-github-pages) | 서브모듈 설정을 바꿔야 하는가? | 바꾸지 않는다. 지금 형태(공개 저장소, HTTPS 주소)를 유지해야 배포가 성공한다. 이 규칙을 README에 경고로 남긴다. | 자체 해소 |
| 4 | reveal.js 현재 안정 버전은 6.0.1. 초기 가정(5.x)은 구식. 6.0에서 플러그인 경로 등 변경 있으나 비-모듈 `<script>` 방식은 영향 미미 (https://revealjs.com/upgrading/, https://www.jsdelivr.com/package/npm/reveal.js) | 예시 발표자료의 reveal.js 버전을 무엇으로 할 것인가? | 6.0.1로 고정한다. 옛 튜토리얼의 플러그인 경로를 복사하지 않는다. | 자체 해소 |
| 5 | CDN 로딩은 인터넷 없는 발표장에서 전면 실패. 저장소 포함(vendoring) + 공유 사본(`/vendor/`) 구조가 정적 사이트 표준 패턴 (https://revealjs.com/installation/) | 발표장에 인터넷이 없어도 슬라이드가 열려야 하는가? | 열려야 한다. reveal.js 한 사본을 `vendor/` 폴더에 넣고 모든 발표자료가 공유한다. | 사용자 |
| 6 | `league` 등 일부 테마는 Google Fonts를 @import — 오프라인에서 폰트 폴백. `white`/`black`은 폰트 base64 내장(각 약 575KB)으로 자기완결 (https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/theme/league.css 실측) | 어떤 테마 파일을 저장소에 넣을 것인가? | 오프라인에서도 완전한 white·black 두 테마만 넣는다. 다른 테마는 그 테마를 쓰는 발표가 생길 때 추가한다. | 자체 해소 |
| 7 | 카드에서 발표자료로 넘어가는 페이지 전환은 cross-document View Transitions로 구현 가능하나 Baseline 미달(약 92%). 미지원 브라우저는 즉시 교체로 자연 폴백 (https://caniuse.com/view-transitions) | 페이지 넘김 애니메이션을 어떤 기술로 만들 것인가? | 이동 자체는 일반 링크(`<a>`)로 한다. 부드러운 전환은 지원 브라우저에만 장식으로 얹는다. | 자체 해소 |
| 8 | CSS scroll-driven animations는 Firefox 미지원으로 Baseline 아님(약 82%). IntersectionObserver 방식이 전 브라우저 기본기 (https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/) | 카드 등장 애니메이션을 어떤 기술로 만들 것인가? | 화면 진입 감지(IntersectionObserver) 방식으로 만든다. 순차 등장은 지연 시간 차이로 표현한다. | 자체 해소 |
| 9 | prefers-reduced-motion 전역 리셋은 View Transitions·캔버스 애니메이션에 자동 적용되지 않음 — 별도 분기 필요 (https://web.dev/articles/prefers-reduced-motion) | 움직임 줄이기 설정에서 무엇까지 멈출 것인가? | 전부 멈춘다. 별 입자 움직임과 페이지 전환 효과도 각각 별도 분기로 끈다. | 자체 해소 |
| 10 | 별/입자 필드는 소량(50~150개)이면 순수 CSS(box-shadow)로 충분하고 메인 스레드 부담 0. canvas는 이 규모에서 과잉 (https://css-tricks.com/grainy-gradients/, https://freefrontend.com/css-particle-backgrounds/) | 우주 느낌을 어느 강도로 표현할 것인가? | 흰 바탕에 미세한 점 입자, 얇은 선, 눈금·좌표 디테일을 더한다. 구현은 순수 CSS로 한다. 실물 이미지는 쓰지 않는다. | 사용자 |
| 11 | Pretendard variable dynamic subset이 한국어 웹폰트 실무 표준. 웹폰트 헤딩은 LCP/CLS 주의 필요 (https://github.com/orioncactus/pretendard, https://web.dev/articles/font-best-practices) | 랜딩 글꼴을 무엇으로 할 것인가? | Pretendard를 CDN에서 버전 고정으로 불러온다. 랜딩에만 쓰고, 발표자료는 각자 자유다. | 자체 해소 |
| 12 | 응답 캐시가 `max-age=600`(10분)으로 고정 — 목록 JSON 갱신이 방문자에게 늦게 보일 수 있음 (https://mrmarble.dev/blog/caching-github-pages/) | 새 발표자료가 목록에 즉시 보여야 하는가? | 최대 10분 지연을 받아들인다. 목록 요청은 재검증 방식(cache: no-cache)으로 지연을 줄인다. | 자체 해소 |
| 13 | 서버가 경로 대소문자를 구분(Linux). 존재하지 않는 경로는 루트의 404.html이 처리 (https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site) | 잘못된 주소로 들어온 방문자를 어떻게 처리할 것인가? | 랜딩으로 안내하는 404 페이지를 둔다. 발표 폴더 이름은 전부 소문자로 강제한다. | 자체 해소 |
| 14 | 카드 그리드 접근성 표준: `<ul><li>` + 카드 전체 클릭은 block link 패턴, `:focus-visible` 2px 이상, 비텍스트 명암 3:1 (https://www.nomensa.com/blog/how-build-accessible-cards-block-links/, https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | 카드 접근성을 어느 수준까지 지킬 것인가? | 목록 구조, 키보드 포커스 표시, 명암비 3:1을 기본으로 지킨다. 흰 바탕·검정 본문은 그대로 유지한다. | 자체 해소 |
| 15 | 요구사항 미해결 항목: 새 발표자료 추가 절차의 문서화 위치 | 예시 발표자료에 어떤 내용을 담을 것인가? | "새 발표자료 추가 방법" 안내를 담는다. 예시 자료가 곧 사용 설명서가 된다. 같은 절차를 README에도 적는다. | 자체 해소 |
| 16 | reveal.js는 MIT 라이선스 — 사본 재배포 시 저작권 고지·라이선스 전문 유지 필요 (https://github.com/hakimel/reveal.js) | 라이선스 요건을 어떻게 지킬 것인가? | reveal.js 원본 LICENSE 파일을 vendor 폴더에 함께 둔다. | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 발표자료가 수십 개로 늘면 목록 화면을 어떻게 나눌 것인가? (검색, 연도별 구분 등) | 지금은 발표자료가 1개뿐이라 결정할 근거가 없다. | 발표자료 10개 도달 시 |
| 2 | Firefox가 스크롤 연동 애니메이션을 지원하면 고급 연출을 추가할 것인가? | 브라우저 지원이 아직 완성되지 않았다. | Firefox 정식 지원 발표 시 |
| 3 | 발표 영상 같은 대용량 파일은 어디에 올릴 것인가? (파일당 100MiB 초과는 push 불가) | 이번 작업에는 영상이 없다. | 영상 포함 발표자료가 처음 생길 때 |

## 스캔 원본 요약

### domain

**GitHub Pages 배포 동작** (researcher A): Deploy from a branch = checkout(서브모듈 포함) → Jekyll 빌드(기본 ON) → Fastly CDN 게시. `.nojekyll`로 Jekyll만 우회 가능하며 체크아웃·서브모듈 처리는 그대로. Liquid `{{ }}` 충돌(P1), 닷 디렉터리 노출(P2), 서브모듈 HTTPS/공개 불변식(P3), 대소문자 구분(P4), `Cache-Control: max-age=600` 고정(P5), mixed content(P6), 1GB 사이트/100MiB 파일/100GB월 대역폭(P7). 출처: docs.github.com(pages), github.blog, community discussions, mrmarble.dev.

**reveal.js 6.0.1** (researcher B): 최소 구성 3파일(reveal.css, 테마 css, reveal.js) + `Reveal.initialize()`. 데크는 자기완결 HTML이라 테마·전환 완전 독립(내장 테마 12+2종, transition 6종). 실측 용량: reveal.js 117KB, reveal.css 54KB, white/black 테마 각 575KB(폰트 base64 내장), league 등은 Google Fonts @import 포함 → 오프라인 폰트 폴백 주의. jsDelivr `@6.0.1` 정확 버전 고정 필수. 비-모듈 `<script src>` 방식은 file:// 더블클릭도 동작(ES 모듈은 CORS로 실패). MIT 라이선스, LICENSE 동봉으로 충족. 출처: revealjs.com(installation/markup/config/themes/transitions/upgrading), jsdelivr.com, github.com/hakimel/reveal.js.

**모던 랜딩 기법** (researcher C): reveal.js 어휘 매핑 — 슬라이드 전환→View Transitions(cross-document, Chrome126+/Safari18.2+, FF 진행 중, ~92%, 자연 폴백), fragment→IntersectionObserver+stagger(전 브라우저), auto-animate→view-transition-name. scroll-driven animations는 FF 미지원(~82%)이라 보조 전용. `@starting-style` ~87%, CSS nesting Widely available(핵심 레이아웃은 비의존 권장). prefers-reduced-motion 전역 리셋 + VT/입자 별도 게이팅 필수. 별 필드는 box-shadow 다중 그림자(50~150개, 컴포지터 전용)로 충분, 그레인은 큰 면적 페인트 비용 주의. Pretendard variable dynamic subset(jsDelivr, 버전 핀, preconnect, 히어로 font-display: optional/fallback). 카드 = ul/li + block link + :focus-visible ≥2px, 헤어라인·포커스 비텍스트 명암 3:1. 출처: MDN(View Transitions), caniuse, web-features-explorer, web.dev(prefers-reduced-motion/fonts), css-tricks, nomensa, W3C WCAG 1.4.11.
