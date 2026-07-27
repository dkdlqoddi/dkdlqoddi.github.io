# cds-agentic-work 발표 덱 비주얼 개편 Unknown Unknowns

- 날짜: 2026-07-27
- 입력: [요구사항 문서](2026-07-27-cds-agentic-work-visual-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | Assertion-Evidence 규격·실험 근거 (https://peer.asee.org/assertion-evidence-slides-appear-to-lead-to-better-comprehension-and-recall-of-more-complex-concepts.pdf) | 장 제목을 결론 문장으로 바꿀지, 지금처럼 명사구로 둘지 | 모든 장(모핑용 추가 장 포함)의 제목을 결론 문장(10어절 이내, 최대 2줄)으로 바꾼다. 이 규격에서 제목 조항만 채택한다. 불릿 전면 금지 조항은 채택하지 않는다. 어절 하한은 두지 않는다(짧고 완결된 주장 허용). | 사용자 |
| 2 | slideument 함정 + 공개 URL 잔존 (https://extraordinaryteam.com/slide-presentation-handout-slideument/) | 걷어낸 설명을 부록 장이나 별도 문서로 옮길지 | 옮기지 않는다. 덱은 발표 전용으로 쓴다. | 사용자 |
| 3 | auto-animate는 `disable-slide-transitions`로 zoom을 무조건 덮음 (vendor/reveal.js/dist/reveal.js `Z()`, slides/cds-agentic-work/index.html:392,454,466) | 요청 3장(13·17·18장)의 확대 전환을 지킬지, 모핑으로 바꿀지 | 확대 전환을 지킨다. 모핑은 구조 설명 장에만 쓴다. | 사용자 |
| 4 | auto-animate 주입 규칙은 특이성 (0,2,0)+`!important`라 덱의 `*` 차단(0,0,0)을 이김 (vendor/reveal.js/dist/reveal.js `autoAnimateElements`) | 모션 최소화 사용자에게 모핑이 그대로 재생되는 문제를 어떻게 막을지 | 모션 차단 블록에 같은 세기(우선순위)의 차단 규칙 한 줄을 추가한다. 기존 CSS 방식 관례를 따른다. | 자체 해소 |
| 5 | auto-animate 잔류 시트(`!important`)가 인쇄 되돌림(비-important)을 이겨 종이에서 회백색 글자가 남음 (vendor/reveal.js/dist/reveal.js, slides/cds-agentic-work/index.html:139-146) | 모핑을 본 뒤 인쇄하면 색 되돌림이 깨지는 문제를 어떻게 막을지 | 기존 열거식 되돌림 목록은 유지한다. 그 전체에 우선순위 최고 표시(`!important`)를 붙인다. 요구사항의 "인쇄는 안전" 판단을 일부 뒤집는 조치라 요구사항 문서도 보완했다. | 자체 해소 |
| 6 | fragment는 클래스 토글 + transition뿐이라 차단 블록이 정상 작동 (vendor/reveal.js/dist/reveal.css `.reveal .fragment`) | 단계 공개가 모션 최소화 설정과 충돌하는지 | 충돌하지 않는다. fragment 때문에 추가로 손댈 것은 없다. 4번의 한 줄 추가만 반영한다. | 자체 해소 |
| 7 | `pdfSeparateFragments` 기본 true → 단계 수만큼 PDF 페이지 복제, 60~80쪽 위험 (vendor/reveal.js/dist/reveal.js 기본값 객체) | 전용 인쇄 주소(`?view=print`)의 쪽수 폭증을 막을지 | 단계별 쪽 나눔을 끄는 설정(`pdfSeparateFragments: false`)을 초기화에 넣어 장당 1쪽으로 고정한다. 요구사항의 "인쇄는 안전" 판단을 보완하는 조치다. | 자체 해소 |
| 8 | r-fit-text는 `white-space:nowrap`+재측정 부재로 한국어 keep-all·수동 줄바꿈과 충돌 (vendor/reveal.js/dist/reveal.js `layout()`, slides/cds-agentic-work/index.html:48) | 글자 자동 확대 기능을 쓸지 | 쓰지 않는다. 크기는 CSS로 직접 지정한다. | 자체 해소 |
| 9 | r-stack은 순수 CSS grid라 오프라인·레이아웃 안전 (vendor/reveal.js/dist/reveal.css `.r-stack`) | 겹쳐 놓고 차례로 보여주는 배치를 무엇으로 만들지 | 겹쳐 쌓기는 reveal 내장 기능(r-stack)으로만 만든다. | 자체 해소 |
| 10 | fragment 불릿 지연은 시각화가 아니라 지연일 뿐 (https://education.nsw.gov.au/about-us/education-data-and-research/cese/publications/practical-guides-for-educators/managing-cognitive-load-through-effective-presentations) + 조작 수 = 19+N (vendor/reveal.js/dist/reveal.js `Ht`) | 단계 공개를 어디에 몇 개까지 허용할지 | 글머리표 줄에는 걸지 않는다. 다이어그램 조각에만 건다. 다이어그램당 3~5단계, 덱 전체 단계(클릭) 40회 이하로 제한한다. | 자체 해소 |
| 11 | `highlight-red/green/blue`는 유채색 (vendor/reveal.js/dist/reveal.css) | 강조용 fragment 효과 중 무엇을 금지할지 | 색이 있는 highlight 계열은 쓰지 않는다. 무채색 원칙을 지킨다. | 자체 해소 |
| 12 | 인쇄 시 reveal이 모든 div를 `display:block`으로 리셋해 flex 도형 배치가 무너짐 (vendor/reveal.js/dist/reveal.css) + em 상자는 폰트 상향 시 960px 초과 (slides/cds-agentic-work/index.html:172-177, 5장 실측 추정) | 새 다이어그램을 CSS 상자로 그릴지, 코드 그림(SVG)으로 그릴지 | 구조 다이어그램은 인라인 SVG로 새로 그린다. 종이에서도 배치가 보존되고 폭이 고정된다. 단순 비교·목록은 기존 CSS 클래스를 유지한다. | 자체 해소 |
| 13 | SVG의 fill/stroke에는 CSS 색 되돌림이 안 닿음 (conventions 스캔 F1) | 새 SVG가 흰 종이에서 사라지는 것을 어떻게 막을지 | 새 SVG는 색을 "현재 글자색을 따라가는 값"(currentColor)으로 그린다. 새 SVG용 인쇄 되돌림은 한 줄 규칙만 추가한다. 기존 열거 목록은 5번대로 유지한다. | 자체 해소 |
| 14 | 가장 어두운 회색 `#2a2b2a`는 배경 대비 1.36:1로 WCAG 3:1 미달 (https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | 다이어그램 선 색을 무엇으로 제한할지 | 뜻을 나르는 선·테두리·화살표는 대비 3:1을 넘는 세 색(`#9aa0a6`, `#dedede`, `#fcfcfb`)만 쓴다. `#2a2b2a`는 장식 전용으로 격리한다. 기존 `.steps` 미도달 칩 테두리도 `#9aa0a6`로 올린다. 팔레트는 늘리지 않는다. | 자체 해소 |
| 15 | em 중첩 복리로 실제 최소 글자가 8.9px까지 떨어짐 (slides/cds-agentic-work/index.html:275, 42px×0.5×0.85×0.5) | 글자 크기 하한을 어떻게 정할지 | 중첩 곱을 해소한다. 글자 하한은 캔버스 기준 24px로 정한다. 캔버스는 발표 화면에서 약 1.5배 확대되므로 실제 표시는 권고치(24pt = 32px)를 넘는다. | 자체 해소 |
| 16 | 오버뷰(Esc)에서 미공개 fragment가 `visibility:hidden`으로 빈칸 (vendor/reveal.js/dist/reveal.css) | 리허설 조망 화면의 빈칸을 보정할지 | 덱 CSS에 오버뷰 한정 보정 한 줄을 추가한다. | 자체 해소 |
| 17 | reveal 낭독 안내는 `visibility:hidden`을 안 거르고 `aria-label`도 안 읽음 (vendor/reveal.js/dist/reveal.js `getStatusText`) | 화면낭독기 사용자에게 단계 공개를 어떻게 전할지 | 숨김 전체 설명(visually-hidden)을 장 진입 시 한 번에 제공한다. 설명은 조각내지 않는다. 기존 관행을 유지한다. | 자체 해소 |
| 18 | file://에서 `history.replaceState` 예외 시 auto-animate와 전환이 영구 정지할 가능성 (vendor/reveal.js/dist/reveal.js `writeURL` — try/catch 없음) | 파일로 직접 열 때 모핑이 죽는지 어떻게 확인할지 | 여기서 닫지 않는다. 미해소 항목 2번으로 이월한다. | 자체 해소 |
| 19 | div/span/svg는 auto-animate 자동 매칭 대상이 아님 (vendor/reveal.js/dist/reveal.js `getAutoAnimatePairs`) | 모핑할 도형을 어떻게 짝지을지 | 모핑 대상에는 짝을 알려 주는 이름표(`data-id`)를 반드시 붙인다. 구현 규칙으로 기록한다. | 자체 해소 |
| 20 | `autoAnimateDuration` 기본 1초 — 확정된 등장 모션 범위 0.7~1.2초 안 (vendor/reveal.js/dist/reveal.js 기본값) | 모핑 시간을 조정할지 | 기본 1초를 그대로 쓴다. 설정을 늘리지 않는다. | 자체 해소 |
| 21 | sample 역이식 판례: 모든 덱이 물려받을 패턴은 실물, 대상 없는 규칙은 주석 (docs/blindspot/space-theme-implementation-notes.md:35-38) | 이번 개편의 새 표현 기법을 sample에도 넣을지 | 이번에는 넣지 않는다. 보고서의 "남은 것"에 기록해 다음 기회로 넘긴다. | 자체 해소 |
| 22 | 스타일 참고 후보 조사 완료 (https://revealjs.com/layout/, https://revealjs.com/auto-animate/, https://brettsnaidero.github.io/svg-animation-slides/, org-teaching 26장, https://github.com/tmcw/big) | 어떤 발표 자료를 표현 방식의 기준으로 삼을지 | reveal 공식 layout·auto-animate 문서를 기준으로 삼는다. SVG 단계 공개는 brettsnaidero 덱과 org-teaching 덱(https://olberger.gitlab.io/org-teaching/slides.html) 둘을 참고한다. 큰 글자 리듬은 tmcw/big을 참고한다. | 자체 해소 |
| 23 | 어두운 방=밝은 글씨 경험칙, 프로젝터 체감 대비 약 30% 하락 (https://www.edwardtufte.com/notebook/recommended-background-for-projected-presentations/) | 발표장 밝기에 대비할지 | 저장소 밖 조치라 범위에서 제외한다. 발표 전 실제 장비 테스트만 권고로 남긴다. | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 20장 각각을 어떤 시각 유형(다이어그램, 단계 공개, 모핑, 글자 유지)으로 바꿀지 | 장별 매핑은 설계 산출물 그 자체라 여기서 정하면 설계 문서와 중복된다 | explainer 작성 시 |
| 2 | 파일로 직접 열 때(file://) 모핑이 정상 동작하는지 | 코드만으로 단정할 수 없어 실측이 필요하다 | 구현 중 첫 모핑 장 완성 직후 |
| 3 | 글자를 키운 뒤 각 장이 세로 700px 예산을 넘는지 | 장별 실제 높이는 고쳐 봐야 안다 | 구현 중 장별 검증 (오버뷰 화면을 검사 도구로 사용) |

## 스캔 원본 요약

### conventions

- 인쇄 되돌림 열거식은 reveal 인쇄 규칙의 구멍(테두리 색 미복구, p/td/li만 복구)을 정확히 메운 목록 — 포괄 규칙 전환 시 `html:not(.print-pdf)` 가드 유지 필수 (vendor/reveal.js/dist/reveal.css, slides/cds-agentic-work/index.html:138-148)
- 일반 인쇄에서 `.diagram`/`.cols` flex 배치는 이미 무너짐 — reveal이 div를 `display:block`으로 리셋 (특이성 0,2,2 > 0,2,0). SVG는 리셋 목록에 없어 배치 보존
- reduced-motion 차단은 `@media (prefers-reduced-motion: reduce)` 안 — 일반 사용자 무영향 (slides/cds-agentic-work/index.html:124-131)
- `.fragment` 커스텀 CSS 선례 0건 — 내장 클래스만 사용이 현 관례. 기본 `transition: all .2s` 주의
- 덱 CSS는 단일 인라인 `<style>` 관례, 외부 파일 분리는 기각 이력 (docs/blindspot/cds-agentic-work-implementation-notes.md:12-13). 분량 상한 규칙 없음
- `?v=` 캐시 무효화는 랜딩 styles.css 전용 — 덱 개편과 무관 (index.html:18)

### similar-features

- 재사용 자산: `--ease: cubic-bezier(0.16,1,0.3,1)` + `rise`(0.7s, blur 5px→0) 등장 곡선, `calc(var(--i) * 80ms)` 계단 지연 관용구, 별 2겹 box-shadow(이식 완료), HUD 노크아웃 기법 (styles.css:15,219-227,264-272,89)
- 덱 도형 7종: `.diagram`(nowrap flex)/`.box`/`.box.dashed`/`.link`(화살촉 없음)/`.cols`(N등분)/`.steps`(3단계 상태 알약)/`.checks`/`.ask` — 흐름·비교는 커버, 화살촉·타임라인·계층·큰 숫자는 미보유 (slides/cds-agentic-work/index.html:153-209)
- reveal 코어 헬퍼 `r-stack`/`r-hstack`/`r-vstack` 미사용 상태로 동봉 — 겹쳐 쌓기 무료
- 인라인 SVG 선례는 우주선 1종(3곳 복제): viewBox + 크기 CSS 위임 + hex 하드코딩(currentColor 미사용), SMIL 기각 이력 (docs/blindspot/2026-07-27-space-theme-explainer.md:54)
- zoom 3건은 explainer가 명문화한 "요청은 셋뿐" 수사 장치 (docs/blindspot/2026-07-23-cds-agentic-work-explainer.md:105)
- 밝기 위계 4단(#fcfcfb/#dedede/#9aa0a6/#2a2b2a) + 굵기 2단(500/600). 크기는 em 중첩 복리로 최소 8.9px까지 붕괴 — 19장 인라인 style 예외 1건 (slides/cds-agentic-work/index.html:480)

### integration-points

- fragment = `visible` 클래스 토글 + `transition: all .2s`. reduce 사용자에게 즉시 표시로 안전 열화
- auto-animate = 런타임 `<style>` 주입, `[data-auto-animate-target]` (0,2,0) + 전 선언 `!important` — 덱 `*` 차단을 이김. reveal 6.0.1에 prefers-reduced-motion 자체 감지 0건
- auto-animate 최종 상태 규칙이 다음 모핑까지 시트에 잔류 — 인쇄 되돌림(비-important)을 이김. `?view=print` 경로는 모핑 미실행이라 무해
- 기본값 실측: `fragments:!0, fragmentInURL:!0, autoAnimate:!0, autoAnimateDuration:1, pdfSeparateFragments:!0, minScale:.2, maxScale:2`. 현 initialize는 `hash`/`transition`만 (slides/cds-agentic-work/index.html:516-519)
- 인쇄 두 갈래: Ctrl+P는 fragment 강제 노출(`transform:none!important` 포함 — transform 배치 금지), `?view=print`는 fragment 그룹당 페이지 복제
- 캔버스 초과분은 `overflow:hidden` 잘림, `top` 0 클램프. 폭 435px 이하는 스크롤 뷰 자동 전환
- 해시: `history:false`라 fragment 진행은 replaceState만 — 뒤로가기 1회로 랜딩 복귀 유지. `history:true` 금지 기록 가치
- r-fit-text는 fitty 내장이나 `observeMutations:false` + 폰트 로드 훅 0건 — Pretendard `font-display:block`과 경합 시 오측정 영구 잔존

### edge-cases

- `?view=print` 페이지 = 장당 1 + fragment 그룹 수. 인덱스 미지정 시 fragment 1개 = 1그룹. 총 40~60개면 60~80쪽
- 조작 = 19 + N 확정. 발표자 뷰 부재(notes 플러그인 없음) — `Alt+화살표`가 유일한 건너뛰기
- auto-animate 쌍이면 `.slides`에 `disable-slide-transitions` 부착 — zoom `transition/transform` 전부 `!important` 무력화
- file:// `writeURL` 예외 시 `disable-slide-transitions` 영구 잔류 + `_e.run()` 미실행 위험 — try/catch 없음, 실측 필요
- 가로가 먼저 터짐: `.box` min-width em 비례 + `overflow-wrap:anywhere`가 keep-all을 깨고 어절 중간 절단. 16:9에선 증상 은폐, 4:3에서 발현
- `<br>` 41개 — 폰트 상향 후 전수 재검수 필요
- 낭독 누출: `getStatusText`는 visibility:hidden 미필터 + aria-label 미낭독 — 미공개 fragment 텍스트가 장 진입 시 전부 낭독됨
- 오버뷰: fragment `opacity`만 복구, `visibility` 미복구 — 빈칸. 덱 한 줄 보정 가능. 오버뷰 section `overflow:hidden`은 넘침 검사 도구로 유용
- auto-animate 매칭: 제목/문단/li/img/pre만 자동 — div/svg는 `data-id` 필수. fragment 겹침 시 opacity 충돌 회피 내장. 별 배경 성능 저하 근거 없음

### domain

- Assertion-Evidence: 제목=완결 주장 문장(8~14단어≒한국어 6~10어절, 28pt+, 최대 2줄), 장당 주장 1개, 불릿 금지 — 이해도·회상 실험 검증 (Penn State/ASEE)
- 페이스: 20장/20~30분 = 장당 60~90초로 A-E 페이스. Takahashi식 폭증과 충돌 — 채택 안 함
- 단계 공개 적정선: 다이어그램당 3~5단계, 누적형(구조 설명)과 교체형(비교) 구분. `fade-out`/`current-visible`로 교체 공개 가능
- fragment 함정 3종: PDF 폭증 / 클릭 부하(목적 없는 애니메이션 = seductive details) / 불릿 지연(시각화 아님)
- 무채색 위계: 크기·굵기·여백·선 두께 조합. 줄간격 1.4~1.6배. Tufte data-ink — 비데이터 잉크 제거, 선 두께 2단계
- WCAG 1.4.11: 필수 그래픽 선 3:1 — `#9aa0a6` 7.3:1 통과, `#2a2b2a` 1.36:1 탈락
- 참고 덱: revealjs.com layout/auto-animate/demo, brettsnaidero SVG 애니 덱(stroke-dasharray 선 그리기), org-teaching SVG 내부 fragment(26장), tmcw/big(다크 무채색 큰 글자 리듬)
- 발표장: 프로젝터 체감 대비 30% 하락, 본문 24pt/제목 30pt 하한 권고, 뒷자리 테스트 권고
