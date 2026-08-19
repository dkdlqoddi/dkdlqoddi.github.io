# opencode serve 방법 5·6 승격 + 전체 발표자료 리뷰 작업 보고서

- 날짜: 2026-08-20
- 기준: main → feat/serve-methods-review (HEAD)
- 퀴즈: docs/blindspot/quiz/2026-08-20-serve-methods-and-review.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

1부 발표자료에 새 장 두 개가 들어가 "사내 LLM 연결 방법"이 4가지에서 6가지가 됐습니다. 방법 5는 opencode를 서버로 띄워 두고 터미널에서 부르는 예시, 방법 6은 같은 서버를 파이썬으로 부르는 예시입니다. 화면에 실린 코드는 실제 서버(opencode 1.17.18)로 돌려 확인했고, 파이썬 예시의 출력 "2"는 실제로 받은 응답입니다. 발표 대본도 함께 갱신됐습니다 — 1부 16장, 유인물 43쪽, 실측 합계 45분 45초(45분 엄수 시 첫 압축 항목 적용 안내 포함). 아울러 자료 전체 점검에서 나온 결함을 고쳤습니다 — 흰 종이 인쇄에서 코드와 두 자료(설계 AX 전환, 안전한 AI 아키텍처)의 네온 도형이 사실상 안 보이던 문제, 복사 단추가 키보드로는 안 보이던 문제, 랜딩을 인쇄하면 우주 배경이 종이에 찍히던 문제, "움직임 줄이기" 설정에서도 남아 돌던 배경 움직임입니다.

### 스크린샷 / 데모

해당 없음 — 세션 중 헤드리스 브라우저 실측으로 확인(수치는 아래 검증 결과). 로컬 확인 방법: `python3 -m http.server 8000` 후 http://localhost:8000/slides/dx-vs-ax-automation/#/11 (방법 5), #/12 (방법 6), #/6 (계단), #/13 (비교표).

### 리뷰 포인트 (개발자용)

- slides/dx-vs-ax-automation/index.html:508-585 — 신규 방법 5·6 슬라이드(5단 골격 준수, 코드 12줄·최대 가중폭 54.3).
- slides/dx-vs-ax-automation/index.html:341-419 — 계단 6칸 재배치. 세로축 라벨은 "추상화 수준"으로 남아 있고 ⑤⑥은 ④와 같은 높이 — 요구사항 확정 6의 형태이며, "위임 구간" 브래킷과 대본 7장 멘트가 의미를 보완. 비교표의 ⑤ 막대(=① 길이)와 시각적 긴장이 있음(의도된 절충 — 퀴즈로 노출).
- slides/dx-vs-ax-automation/index.html:34-40 — 미터 6칸·축명 "연동 방법", deck-base의 `.reveal p` !important를 되받는 고정폭 우회.
- slides/shared/deck-base.css:195-227 — 인쇄에서 pre/pre code 색 복구 + 테마의 pre code 400px 캡 해제(양 경로). ?v=2 범프, 5개 덱 링크 갱신 완료.
- slides/shared/deck-base.css:76-78 — deck-base 자신의 .eyebrow 고정폭을 자신의 !important가 이기던 자기모순 해소(전 덱 파급 — 눈썹글 서체가 Montserrat에서 고정폭으로 돌아옴).
- slides/integrated-architecture/index.html:72-115 — 인쇄 색 복구 블록(클래스·SVG 속성·인라인 style 3계층). `.btn-return` 포함.
- slides/integrated-architecture/index.html — SMIL→CSS(loop-label-anim), 무가드 애니를 no-preference로 이동, 사문화 :root·중복 선언 제거(라틴 서체가 Pretendard→Montserrat로 통일되는 가시 변화 있음 — 실측 확인 완료).
- slides/design-ax-transition/index.html:33-43 — 인쇄 색 복구(3색 × fill/stroke).
- scripts/galaxy3d.js:287-289, :296-298 — reduced-motion 가드 2곳.
- styles.css:346-352 — 인쇄 숨김 선택자 교정(#galaxy-3d-bg, #hud-lines), 사문화 .scroll-cue/.cue-arrow/bounce 제거. ?v=2 유지(대개편 아님 — 최대 10분 캐시 지연 수용).
- slides/shared/code-copy.css:23-34 — pre:focus-within/:focus-visible 노출 + 포커스 외곽선. 이 파일은 ?v 표식이 없어 10분 캐시로 수렴.
- docs/2026-08-seminar-script.md — 16장 재번호, [→ 5]/[→ 6], 신규 2장 대본, 압축 경로 −8:20, 예상 질문 9~13.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

사용자 요청 2건의 이행: (1) dx-vs-ax 덱에 opencode serve HTTP 호출·Python 라이브러리 호출 예시를 "새 방법 5·6"으로 승격 추가(인터뷰 확정), (2) 전체 발표자료 리뷰 + 발견 즉시 전부 수정(인터뷰 확정). 예시의 모든 사실은 1차 출처(공식 문서 URL + 로컬 1.17.18 실서버 실측)로 검증 후 게재.

### 제약 (Constraints)

- 코드 슬라이드 물리 상한 3중: 12줄(EVA 700px), 가중폭 54자(한글 1.667배), 인쇄 pre code 400px 캡(이번에 인쇄 경로는 해제).
- 5단 골격(미터→visually-hidden→mini-diag→pre>code→small) 준수. 프롬프트 기호 금지(복사 오염), &·< 만 실체참조.
- deck-base 수정 시 ?v= 범프 + 5덱 링크 동기화 강제. vendor/ 불변(three.js 폐기 경고는 수용).
- 과거 퀴즈·보고서는 시점 기록으로 보존(소급 수정 금지). 살아있는 문서(덱·대본·slides.json)만 갱신.
- main 직커밋 금지 — feat/serve-methods-review에서 작업, 퀴즈 통과 후 머지.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 계단 6칸 등피치 불가(가로 여유 25px) | ①~④ 피치 140·폭 125로 압축, ⑤⑥은 ④ 높이의 위임 구간 확장 + 브래킷 |
| 신규 2장 높이 729px(제목·요약 줄바꿈) | 제목·요약 축약으로 664px 확보(한도 700px), 실측 재확인 |
| 비교표 막대 등차 연장 시 3열 침범·대비 미달 | ⑤=①·⑥=② 길이의 정직 표기, 전 행 불투명도 0.5 이상 |
| curl 줄 폭 55.0(관례 54.3 초과) | 프롬프트를 "1+1은?"로 축약해 49.7 |
| 공식 Python SDK 실재하나 알파 정지 | 로컬 실측(전송 성공·응답 필드 전부 None) 근거로 requests 채택, 요구사항 2 개정 |
| model 필드 생략 동작 | 실측: 무자격 상태에서 무료 기본 모델(opencode/big-pickle)로 해결, 200 + 실답변 |
| 대본 [→ n] 규약(고유 인덱스 수) | 7장 [→ 5]·14장 [→ 6], 16장 전부 실물과 1:1 대조 통과 |
| auto-animate 짝(4↔5장) 파손 위험 | 삽입 지점(11↔12장 사이)이 짝과 격리 — 무영향 확인 |
| 해시 주소 밀림(#/11 이후) | 저장소 내 #/N 참조 0건 + 수용 선례 2건 — 수용 |
| 2부 미터와의 혼동 | 글리프(원문자 vs 평문)·라벨(연동 방법 vs 자율성)로 구분 유지, 상호 주석 동기화 |
| 동작 축소에서 integrated 점이 엉뚱한 위치에 고정 | 기본 opacity 0 + no-preference 가드(1부 travel-dot 패턴) |
| 인쇄 시 마지막 장 버튼(.btn-return) 네온 잔존 | 인쇄 복구 목록에 추가(변경 분석이 적발) |
| deck-base !important가 자기 .eyebrow 고정폭을 이김 | deck-base 안에서 되받기(전 덱 치유), 2부 미터도 동일 우회 추가 |

### 검증 결과

- check-runner 10항목 전부 통과: slides.json 유효, dir↔index.html 4/4, 5덱 HTML 건전성(section 수지·중괄호·mojibake 0), viewport/color-scheme/외부 리소스 0건, ?v=2 5/5, "4가지" 잔존 0건, 코드 12줄·54.3 이내, .nojekyll/서브모듈 정상, node --check 통과, 대본↔덱 16장·[→ n] 16/16 일치.
- Playwright 실측: 1부 16장 전부 높이 상한 이내(코드 4장 664px, 비교표 520px), 계단 라벨 6개 모두 칸 폭 이내, ①~⑥ 원문자 정상 렌더, 2부 터미널 장 10개 480~522px(≤660), 콘솔 오류 0(경고는 vendored three.js 폐기 예고 1건뿐).
- 인쇄 에뮬레이션: dx 코드 검정/흰 배경·캡 해제, integrated 제목 #000·도형 어두운 동색·btn-return 판독색, design-ax 색 복구, 랜딩 캔버스·연결선 숨김 — 전부 확인.
- 동작 축소 에뮬레이션: integrated 점 3종 숨김·루프 라벨 정적 표시, 2부 27장 정상.
- 실서버 실증: 슬라이드 코드를 HTML에서 원문 추출해 opencode serve 1.17.18(포트 4096)로 실행 — 방법 5 exit 0 + 응답 구조 일치, 방법 6 출력 "2" 일치. 테스트 세션 삭제 완료.

### 의도적 범위 제외

- design-ax·integrated의 currentColor 전면 재작성 — 인쇄 덮어쓰기로 기능은 동일, 비용 10배라 후속 과제(각 덱 주석에 명시).
- galaxy3d.js의 rAF 루프 정지 — 모션은 전부 정지했으나 정적 장면 렌더 루프는 유지(랜딩 상호작용 의존). 전력 최적화는 제안으로만.
- 계단 세로축 라벨("추상화 수준") 유지 — 요구사항 확정 6의 형태. 재라벨은 요구사항 재개정 사안.
- integrated 마지막 장의 기존 50px 넘침 — main과 동일한 기존 상태로 EVA VIEW 내부 스크롤이 설계대로 흡수(터치에서는 하단 도달 불가라는 EVA 자체 한계는 기존과 동일). 미수정.
- 인쇄 svg display:block!important의 잠복 유령 텍스트(title/desc 0건이라 미발현) — unknowns 미해소 1로 이월.
- 과거 퀴즈·보고서·README의 낡은 수치 — 시점 기록 보존 원칙으로 미수정.

### 구현 노트 요약

- 이탈 1건: 보안 상세(OPENCODE_SERVER_PASSWORD)의 게재 위치를 슬라이드 요약에서 대본(12장 멘트 + 예상 질문 11)으로 이동 — 요약 줄바꿈으로 높이 상한 29px 초과가 원인. 경고 요지("기본 무인증 — 로컬 전용")는 슬라이드에 유지.
- 전제 정정 2건: unknowns 해소 12의 "2부는 우회 완료"(실제는 터미널 줄 전용 — 2부 미터에 우회 추가), 해소 8의 "총 45:00"(2부 실측 28:45 → 총 45:45, 대본 머리말에 실측과 압축 안내 명기).
- 보수적 선택: 인쇄 색은 "어두운 동색" 매핑(컬러 인쇄에서 의미 보존), 신규 2장 시간 각 0:45(기존 장 시간 불변), 커밋은 브랜치에만.
- 사용자 확인 필요로 표기된 항목: 없음.
