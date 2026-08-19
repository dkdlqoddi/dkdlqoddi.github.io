# DX vs AX 발표자료 종합 개선 Unknown Unknowns

- 날짜: 2026-08-19
- 입력: [2026-08-19-dx-ax-redesign-requirements.md](2026-08-19-dx-ax-redesign-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain
- 비고: conventions 렌즈는 요구사항 단계에서 실행한 결과를 재사용했습니다.
- 요구사항 확장 선언: 이 문서의 조사 결과로 요구사항이 2건 확장되었습니다.
  1. integrated-architecture 덱 전체 수리(한글 복구 + 구조 수정) — 사용자 인터뷰 답변 "전체 수리 포함"으로 승인됨. 요구사항 문서 인터뷰 기록에 반영.
  2. 저장소 설명 문서(CLAUDE.md, README) 갱신 — 새 공유 파일 추가에 따른 부수 작업으로 자체 해소.
- 용어: "인쇄 두 경로"란 브라우저 인쇄 메뉴(Ctrl+P)와 PDF 내보내기 주소(?print-pdf) 두 가지를 뜻합니다.

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | PyPI에 opencode 패키지 없음 (https://pypi.org/pypi/opencode/json → 404) | 슬라이드의 opencode 설치 명령을 무엇으로 고칠지 | 결정: 공식 설치 스크립트(curl)를 표기. 부수: npm 대안을 주석 한 줄로 병기 | 자체 해소 |
| 2 | 현행 CLI에 --headless 없음, -p는 비밀번호 옵션 (https://opencode.ai/docs/cli/) | 비대화식 실행 명령을 무엇으로 고칠지 | 현행 문법 `opencode run "메시지"`로 교체 | 자체 해소 |
| 3 | opencode는 파일을 고치는 코딩 에이전트로, 단순 질문·답변 도구가 아님 (https://opencode.ai/docs/) | 비교표에서 다른 3가지 방법과 나란히 둘 수 있는지 | 범주가 다름(에이전트 실행)을 표에 명시하고 발표 서사의 자산으로 활용 | 자체 해소 |
| 4 | `opencode run --format json`의 출력 형식이 공식 문서에 미기재 (https://opencode.ai/docs/cli/) | 결과 해석(파싱) 코드를 슬라이드에 넣을지 | 검증 불가한 코드는 싣지 않음. 텍스트 출력만 사용 | 자체 해소 |
| 5 | requests는 표준 라이브러리가 아니고 전이 의존성 4개 보유 (https://github.com/psf/requests/blob/main/pyproject.toml) | 비교표의 "의존성 없음" 칸을 어떻게 고칠지 | 결정: "requests 패키지"로 정정. 부수: 표준 라이브러리 대안(urllib)을 한 줄 언급 | 자체 해소 |
| 6 | LangChain 설치 패키지는 langchain-openai (https://docs.langchain.com/oss/python/integrations/chat/openai) | 설치 주석과 예시 문법을 어떻게 맞출지 | 결정: 설치 주석을 langchain-openai로 정정. 부수: 예시 문법과 결과 읽기 방식은 현행 그대로 유지 | 자체 해소 |
| 7 | OpenAI SDK 예시는 현행 규격과 일치 (https://github.com/openai/openai-python) | 예시를 바꿔야 하는지 | 유지. 신형 API 대신 호환 서버 표준(Chat Completions)을 쓰는 이유 한 줄 추가 | 자체 해소 |
| 8 | integrated-architecture 덱 후반 14장 미표시 + 한글 23행 깨짐, 파손 전 버전은 커밋 8b38a8b에 존재 (slides/integrated-architecture/index.html:801-802, 806) | 이 덱을 이번에 어디까지 수리할지 | 전체 수리: 공유 CSS 교체 + 한글 복구 + HTML 구조 수정 | 사용자 |
| 9 | 이름표(data-id) 없는 짝 슬라이드는 미끄러지지 않고 전체가 느리게 사라졌다 나타남 (vendor/reveal.js/dist/reveal.js의 짝 매칭 로직, slides/design-ax-transition/index.html:315,351에 오작동 실례) | 짝 슬라이드 전환(auto-animate)을 어떤 규칙으로 쓸지 | 결정: 움직일 요소마다 이름표(data-id)를 명시. 부수: 두 장의 그림 좌표계(viewBox) 크기를 같게 맞춤 | 자체 해소 |
| 10 | 코드 단계 공개 선례 0건, 코드를 쪼개면 복사 버튼이 개수만큼 생김 (slides/shared/code-copy.js:3) | 코드 블록에도 단계 공개(fragment)를 넣을지 | 넣지 않음. 코드는 12줄 이하로 줄여 한 번에 표시 | 자체 해소 |
| 11 | 테마 CSS와 특이성이 같은 규칙 5건은 파일 순서로 승부가 갈림 (vendor/reveal.js/dist/theme/black.css vs slides/dx-vs-ax-automation/index.html:41-65) | 새 공유 CSS 파일을 어느 위치에 링크할지 | 결정: 테마 파일 뒤, 각 덱 인라인 스타일 앞에 링크. 부수: 색 변수는 항상 이기는 강화 표기(html:root)로 작성 | 자체 해소 |
| 12 | 화면 넘침 방지 규칙이 인쇄 경로에 따라 다르게 깨짐: 인쇄 메뉴에서는 내용이 상자 밖으로 삐져나오고, PDF 내보내기에서는 초과분이 유실되고 빈 페이지가 생김 (vendor/reveal.js/dist/reveal.css 인쇄 블록에 max-height 해제 없음) | 인쇄 시 넘침 방지 규칙을 어떻게 풀지 | 공유 CSS의 인쇄 블록에 두 경로 모두를 위한 해제 규칙을 넣음 | 자체 해소 |
| 13 | 색 이름을 직접 박은 SVG 110곳은 인쇄 색 복구가 안 됨 (slides/dx-vs-ax-automation/index.html:241 등, 복구 규칙 :108-113은 color만 덮음) | 도형 색을 어떤 체계로 다시 칠할지 | 결정: dx 덱 도형만 이번에 상속 색(currentColor)과 클래스 체계로 재작성. 다른 덱의 색 복구는 차기 사이클로 미룸 | 자체 해소 |
| 14 | 모서리 장식(HUD)을 인쇄에서 숨기는 규칙이 5개 덱 모두 없음 (전 덱 @media print 블록에 .hud 부재) | 장식 인쇄 숨김을 어디서 처리할지 | 공유 CSS의 인쇄 블록에서 일괄 숨김 | 자체 해소 |
| 15 | 강제(!important) 폰트 규칙이 한글 폰트(Pretendard)를 대체 목록에서 밀어냄 (slides/dx-vs-ax-automation/index.html:115-117) | 폰트 대체 목록을 어떻게 고칠지 | 결정: 공유 CSS의 대체 목록을 Montserrat 다음 Pretendard 순으로 수리. 적용 덱 범위는 미해소 항목 5번과 함께 설계 단계에서 확정 | 자체 해소 |
| 16 | design-ax-transition 덱에도 sample과 동일한 CSS 파손 3종이 복제됨 (slides/design-ax-transition/index.html:99, 137-143, 154-159) | 이 덱의 파손을 따로 수리해야 하는지 | 별도 수리 불필요. 파손 블록이 전부 공통 영역이라 공유 CSS로 교체하는 순간 함께 사라짐 | 자체 해소 |
| 17 | 은하 배경 스크립트가 동작 축소 설정을 읽어 회전·혜성·카메라 이동을 전부 차단함을 실측 확인 (scripts/galaxy3d.js:146,236,255,263) | 동작 축소 설정에서 은하 배경을 감쇄할지 완전히 숨길지 | 감쇄 유지 확정. 스크립트가 이미 움직임을 멈추므로 흐린 정지 화면(투명도 0.05)만 남기면 규칙을 지킴 | 자체 해소 |
| 18 | 공유 파일 경로 표기가 두 가지로 갈릴 위험 (slides/dx-vs-ax-automation/index.html:17의 ../../slides/shared/ vs 요구사항의 ../shared/) | 경로 표기를 무엇으로 통일할지 | 결정: 전 덱을 ../shared/ 로 통일. 부수: 기존 code-copy 참조 2줄도 같은 표기로 정리 | 자체 해소 |
| 19 | 정적 페이지 캐시가 최대 10분 유지되어 새 HTML과 옛 CSS 조합이 생길 수 있음 (index.html:19의 ?v=2 선례) | 공유 CSS에 캐시 무효화 표식을 붙일지 | 붙임: deck-base.css?v=1. 갱신 때 번호를 올림 | 자체 해소 |
| 20 | 표지 강조 효과의 대상 지정이 덱마다 어긋나 2개 덱에서 죽은 규칙 (slides/sample/index.html:221 h1 지정, 실제 표지는 h2) | 표지 강조 효과 선택자를 어떻게 통일할지 | 결정: 공유 CSS에서 제목 1단계와 2단계(h1, h2)를 모두 지정. 부수: ai-agent 덱 적용 여부는 미해소 항목 5번에서 확정 | 자체 해소 |
| 21 | 기존 머지 전 퀴즈가 옛 슬라이드 구조를 정답 근거로 사용 (docs/blindspot/quiz/2026-08-19-dx-vs-ax-automation.html:25-58) | 옛 퀴즈를 고칠지 새로 만들지 | 새 사이클 보고서에서 새 퀴즈를 생성. 기존 파일은 이력으로 보존 | 자체 해소 |
| 22 | 저장소 설명 문서가 공유 자산 디렉토리 존재를 미기재 (CLAUDE.md Architecture 절, README.md:27-36) | 문서 갱신을 이번 범위에 넣을지 | 포함. 새 덱 작성 규칙에 공유 CSS 링크 항목을 추가 | 자체 해소 |
| 23 | 짝 슬라이드에 쓰인 코드 블록은 스크롤이 강제로 숨겨져 잘림 (vendor/reveal.js/dist/reveal.css의 pre[data-auto-animate-target] 규칙) | 코드 블록을 짝 슬라이드 전환 대상으로 쓸지 | 쓰지 않음. 짝 전환은 다이어그램 전용 | 자체 해소 |
| 24 | 단계 공개 요소의 등장 전 이동값(40px)이 화면 높이 계산에 포함됨 (vendor/reveal.js/dist/reveal.css의 fade-up 규칙) | 슬라이드 내용 높이 상한을 얼마로 잡을지 | 단계 공개(요소가 순서대로 나타나는 효과)가 있는 장은 660px, 없는 장은 700px 이하로 설계 | 자체 해소 |
| 25 | 동작 축소 방어 규칙을 짧게 "정리"하면 특이성이 낮아져 무력화됨 (slides/dx-vs-ax-automation/index.html:105가 유일하게 유효) | 방어 규칙을 공유 CSS로 옮길 때의 규칙 | 결정: dx 덱의 규칙 문구를 한 글자도 바꾸지 않고 그대로 복사. 부수: 짧게 고치지 말라는 경고 주석을 함께 남김 | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 새 슬라이드 순서와 각 장의 시각 구성을 어떻게 짤지 | 설계 문서에서 안을 만들어 사용자 승인을 받기로 요구사항에 확정됨 | 다음 단계(explainer) |
| 2 | 난이도 척도의 최종 표기 | 새 비교표 축 설계와 함께 정해야 일관됨 | 다음 단계(explainer) |
| 3 | 인쇄·화면 수정 결과가 실제 브라우저에서 의도대로 나오는지 | 코드만 읽고 판정한 항목(스크롤 막대 표시, 그림 요소의 위치 계산)이 남아 있음 | 구현 후 브라우저 검증 |
| 4 | integrated-architecture 깨진 한글의 소실 글자를 어떻게 채울지 | 구현 준비 중 실측: 깨진 문장은 깨진 채로 추가되어(커밋 20665e2) 저장 기록에 원본이 없음. 역변환으로 대부분 복원되나 물음표로 소실된 글자는 문맥 재구성 필요 | 구현 단계, 재구성 문장은 구현 노트에 기록 |
| 5 | ai-agent-skills-philosophy 덱을 공통 디자인에 어느 수준까지 맞출지 | 제목이 대문자로 강제 변환되는 현상은 규칙 위반이라 수리 대상이지만, 수리하면 화면이 바뀌어 요구사항의 "화면 불변" 문구와 충돌함. 폰트·표지 효과 적용 범위도 같은 결정에 묶임 | 다음 단계(explainer)에서 사용자 승인 |

## 스캔 원본 요약

### conventions

(요구사항 단계 스캔 재사용) 공통 디자인 = sample에서 복제된 6요소(팔레트 토큰 html:root, HUD 4모서리, galaxy 캔버스, Montserrat 규칙, 표지 글로우, EVA VIEW) + slides/shared/code-copy.{css,js}. dx 덱이 규약 준수도 최고(role="img" 9/9, 인쇄/모션 블록 구문상 정상 — 단 규칙 커버리지 부족은 해소 항목 12·14 참조). sample·design-ax·integrated는 동일 CSS 파손 3종(고아 keyframe, reduced-motion 블록 오염, print 블록 조기 종료) 복제. dx의 이탈: `--accent` 선언 후 미참조(리터럴 107회), `#f05050` 오류색 비표준. 코드 4장 fragment 0. ④DX↔⑤AX 흐름이 auto-animate 교과서 사용처. EVA VIEW 700px 상한과 ⑤AX 다이어그램(900×380) 근접.

### similar-features

auto-animate 정본은 sample:306-363 유일(동일 viewBox + data-id 3쌍 + fragment 공존 실증). design-ax는 data-id 0건으로 통제 불능 페이드, integrated는 짝 없는 죽은 마크업. fragment 어휘 3종(fade-up 13, fade-right 3, fade-left 2), data-fragment-index 전 저장소 0건, `<g class="fragment">` SVG 그룹 단위가 관용구. 필수 동반 CSS: transform-box:fill-box(dx:87), overview 보정(dx:95), pdfSeparateFragments:false 전 덱 통일. 코드 슬라이드 3단 구성(mini-diag→pre→small)은 dx 고유 관용구. 표지 eyebrow/끝. 닫는 장 관용구 3덱 동일. 챕터 divider 선례 0. 비교는 SVG 노선(인쇄 배치 보존) vs HTML table 노선. 다이어그램 정본은 currentColor+.dim/.bright, rx 8/10, stroke-width 1.5/2/2.5, 점선 의미 4종. dx 고스트 오버레이 비교(:366-396)는 보존 가치 최고 자산. integrated는 형광 5색+대시 애니메이션으로 덱 고유(공유 금지). integrated 파손 상세: `</div></div>` 조기 닫힘(:801-802)으로 후반 14장 미렌더, section 태그 24 vs 27 불일치, 한글 mojibake.

### integration-points

code-copy.js: DOMContentLoaded 1회, `querySelectorAll("pre")`→`pre>code` 필수, 버튼은 pre 마지막 자식, innerText 복사 — 축약 무해, pre 분할 시 버튼 증식, code 내부 span 분할 시 복사 오염. galaxy3d.js: 캔버스 id 하나만 계약, 없으면 조용히 반환(ai-agent 링크해도 무해), WebGL 예외 try/catch 없음(검은 화면 유지), 전역 wheel 리스너가 EVA 스크롤과 입력 공유. head 링크 순서: 4덱 "links→style" / ai-agent만 style이 테마 앞(대문자 버그 라이브). EVA VIEW `!important` 공유화 시 덱 예외는 인라인 !important로만 가능. ai-agent에 EVA 블록 2중 삽입(96afa88 치환 사고). 인쇄 2중 결함: ?print-pdf에서 html:not(.print-pdf) 복구 전멸 + EVA max-height 생존. 하드코딩 색: dx 110/integrated 95/ai-agent 45/design-ax 37/sample 0. file:// 위반 0건. 랜딩 결합은 URL뿐. 퀴즈 3문항이 옛 구조 의존. CLAUDE.md/README가 shared/·scripts/·three.js·montserrat 미기재. patch.py류 일괄 치환 스크립트가 과거 사고 원인 — 수동 편집 권장.

### edge-cases

reveal 6.0.1에 prefers-reduced-motion 0회 — 방어는 100% 덱 책임. auto-animate 주입 스타일은 head 말미 + 전 선언 !important(0-2-0) → 방어는 dx:105의 0-3-0 선택자만 유효, 축약 금지. 매칭은 data-id → 제목/문단 텍스트 → pre textContent 완전일치(코드 축약 시 짝 조용히 끊김, Copied! 상태 2초간 키 어긋남). 짝 슬라이드에서 data-transition 무시 + disable-slide-transitions. center:true 측정은 getBoundingClientRect — EVA 스크롤 오염 시 좌표 이탈 → 짝 슬라이드는 700px 이내 필수. `pre[data-auto-animate-target]{overflow:hidden}`(0-2-1)이 덱 스크롤(0-1-1) 격파. EVA 초과분: 데스크톱은 슬라이드 내 스크롤(스크롤바 축소로 거의 안 보임), 터치는 preventDefault로 영구 접근 불가. 인쇄: Ctrl+P는 max-height 생존+overflow 해제(삐져나옴), ?print-pdf는 둘 다 생존(유실+빈 페이지, scrollHeight 기반 페이지 계산). fragment 인쇄 transform:none!important → fragment `<g>`에 transform 속성 금지(현 dx 7개 무사). overview visibility 복구는 덱 규칙(dx:95) 필수. fade-up 40px가 스크롤 높이 부풀림 → 660px 설계 상한. 테마 무승부 5건(대문자/링크 밑줄/pre 크기·그림자/code 패딩/font-weight) — 링크 위치 "black.css 뒤" 고정으로 회피. Montserrat는 실제 vendored(481KB, unicode-range 없음) — !important 스택이 Pretendard 우회, 한글 OS 폰트 낙하 중. 파손 3종은 3덱 복제 확인. 캐시: 링크 CSS 전환으로 "새 HTML+옛 CSS 10분" 창 발생 → ?v=1.

### domain

opencode: 설치는 curl 스크립트/npm(opencode-ai)/brew — pip 없음(PyPI 404). 비대화는 `opencode run [message..]`, --headless 부재, 현행 -p는 --password(조용한 오동작). 레거시 Go v0.0.52(2025-05)에 -p/--prompt 존재 — 덱이 1년 전 CLI 기준. 커스텀 엔드포인트: opencode.json provider.npm="@ai-sdk/openai-compatible" + options.baseURL + {env:} 키 참조. subprocess 패턴 정당하나 --format json 스키마 미문서화 → 파싱 코드 금지. 리포는 anomalyco/opencode로 이전. OpenAI SDK: chat.completions 관용구 현행 일치, "supported indefinitely", 호환 서버엔 Responses보다 이식성 우위. LangChain: pip install langchain-openai, ChatOpenAI(base_url=...) 현행, LCEL 유효(폐기는 LLMChain류), 1.0 서사는 create_agent 중심 이동. requests: 서드파티 + 전이 의존성 4개(charset_normalizer, idna, urllib3, certifi) — "순수 Python"은 urllib.request만 해당(폐쇄망 강점). 비교축 제안: 단발 호출 vs 다단계 조합, 폐쇄망 설치 용이성, 출력 파싱 안정성. 성능 수치는 블로그 근거라 정성 표현만.
