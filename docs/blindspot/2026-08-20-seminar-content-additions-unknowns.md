# 세미나 덱 콘텐츠 3종 추가 Unknown Unknowns

- 날짜: 2026-08-20
- 입력: [2026-08-20-seminar-content-additions-requirements.md](2026-08-20-seminar-content-additions-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 지도 장의 행 목록·배지 문법과 "각 장의 배지가 이 지도를 가리킵니다" 계약 (`slides/ai-agent-skills-philosophy/index.html:273-306`), ②층 담당 스킬 0개 (`:276-287`) | 해부도의 부위를 몇 개로, 무엇 기준으로 나눌지 | 부위 5개를 스킬 5개와 1대 1로 짝짓는다. 오른쪽 패널 안쪽의 배지 자리(지도 장과 같은 우측 정렬 슬롯)에 스킬 이름과 층 원문자(①③④)를 함께 적는다. blindspot-flow도 다른 넷과 같이 부위 한 행을 맡는다. 틀로 감싸는 방식은 쓰지 않는다. ②도구 제한의 행은 아예 만들지 않는다. ②가 빠지는 이유는 대본에서 한 문장으로 짚는다. | 사용자 |
| 2 | opencode 안에서도 HTTP 경계가 두 개라는 공식 문서 확인 (https://opencode.ai/docs/network/ , https://opencode.ai/docs/server/) | 새 그림에 HTTP 경계를 몇 개 그릴지 | 왕복 1개만 그린다. 호출자(내 코드 또는 opencode)와 사내 LLM 사이 구간이다. 사람의 입력은 출발점 표시로만 남긴다. 방법 5·6 구간과의 차이는 발표 대본에서 한 문장으로 짚는다. | 자체 해소 |
| 3 | 새 장에는 코드 블록 금지(요구사항 1), provider마다 주소·필드명이 다름 — OpenAI `/v1/chat/completions`, Anthropic `/v1/messages`, Gemini `:generateContent` (https://platform.claude.com/docs/en/api/messages , https://ai.google.dev/api/generate-content) | 새 그림에 요청 주소와 본문 모양을 표기할지 | 표기하지 않는다. 주소는 제공자마다 달라 하나로 일반화하면 틀린다. 그림에는 "요청(지금까지의 대화 전체)"과 "응답(조각 스트림)" 수준의 개념 라벨만 쓴다. 실제 주소는 방법 1 장이 이미 보여 준다. | 자체 해소 |
| 4 | 되돌아오는 화살표는 두 덱에서 점선+행진 무늬이고, 중립 의미(결과 취합 등) 사용례가 있음 (`slides/ai-agent-skills-philosophy/index.html:925-928`) | 돌아오는 응답선을 어떤 선으로 그릴지 | 흐릿한 색의 점선에 "응답" 라벨을 붙여 그린다. 1부의 점선 주기값(4,3/-14)을 쓴다. 실선 귀환선이라는 새 문법은 만들지 않는다. | 자체 해소 |
| 5 | 여섯 방법 장 모두 종점 상자가 "사내 LLM"으로 통일 (`slides/dx-vs-ax-automation/index.html:422-432` 외 5곳) | 종점 이름을 "사내 LLM"과 "LLM API" 중 무엇으로 쓸지 | 덱 전체와 같은 "사내 LLM"을 쓴다. LLM API라는 일반 명칭은 설명 문장에서만 쓴다. | 자체 해소 |
| 6 | 스트리밍은 SSE 방식이라는 공식 문서 3중 근거 (https://developers.openai.com/api/docs/guides/streaming-responses , https://platform.claude.com/docs/en/build-with-claude/streaming , opencode config의 chunkTimeout) | 응답이 조각으로 흘러온다는 사실을 화면에 어떻게 쓸지 | 그림에는 "조각 스트림" 같은 우리말 개념만 쓴다. SSE라는 약어는 대본에만 쓴다. 하단 각주에는 출처 표기를 둔다. | 자체 해소 |
| 7 | 프로세스 안 추론이라는 진짜 예외가 실재 (https://node-llama-cpp.withcat.ai/), 로컬 모델(Ollama 등)은 로컬 HTTP 서버라 예외가 아님 (https://docs.ollama.com/api/openai-compatibility) | 예외가 있는데 "모든 도구는 HTTP"라고 써도 되는지 | "모든"이라는 낱말을 피한다. "내 코드든 opencode든 같은 원리"라는 문장으로 쓴다. 예외 설명은 대본에만 둔다. | 자체 해소 |
| 8 | 미터는 방법/제품 순번 전용 (`slides/dx-vs-ax-automation/index.html:414` 외, aria-label "6가지 중 N번째") | 새 장 2개에 미터를 붙일지 | 붙이지 않는다. 새 장은 방법도 제품도 아니라서 순번이 없다. | 자체 해소 |
| 9 | 요약 상자는 10곳 전부 3항목이고 마지막은 항상 "철학:" (`slides/ai-agent-skills-philosophy/index.html:354-360` 외). 높이 실측: 현재 557px, 한 줄 항목 41px, 한 줄 정의 2개 추가 시 약 639px(상한 700px) | 정의 두 줄을 요약 상자에 어떻게 넣을지 | 기존 3항목은 문장을 유지한 채 정의 2줄을 상자 맨 앞에 추가한다. 상자는 5항목이 되고 "철학:"은 마지막 자리를 지킨다. 첫 기존 항목의 "(Blindspot)" 괄호 병기만 지워 중복을 없앤다. 각 정의는 반드시 한 줄로 맞춘다. | 자체 해소 |
| 10 | 맹점과 미지의 미지는 다른 개념 — Johari 창의 blind area와 unknown area (https://en.wikipedia.org/wiki/Johari_window , https://en.wikipedia.org/wiki/There_are_unknown_unknowns). 한 줄 용량: 한글 36자, 라벨이 길면 본문 여유 급감 (edge-cases 실측) | 두 정의의 확정 문구를 무엇으로 할지 | 확정 문구: "맹점(Blindspot): 남은 아는데 나만 못 보는 사각지대." / "미지의 미지(Unknown Unknowns): 모른다는 것조차 모르는 것." 두 줄 다 한 줄 용량 안이다. 유래 이야기(1960년대 기원, 2002년 대중화)는 대본에만 둔다. | 자체 해소 |
| 11 | HTML 2단은 인쇄에서 무너짐 — reveal 인쇄 규칙이 div를 세로로 폄 (vendor/reveal.js/dist/reveal.css, edge-cases 인쇄 실측) | 해부도를 HTML 2단으로 짤지, SVG 한 장으로 그릴지 | SVG 한 장 안에 좌우 패널 두 개를 그린다. 지도 장의 패널 좌표(x=50/470, 폭 390)를 재사용한다. (구현 확정: 배지 슬롯은 오른쪽 여백 40px 규격 — 원문자 x=780/820, 스킬 이름 끝 x=740) | 자체 해소 |
| 12 | 좌우 비교의 기존 색 문법: 참조 쪽 dim, 좋은 쪽 accent (`slides/dx-vs-ax-automation/index.html:140-167`). 층 원문자 색 규약: ①③=accent, ②④=danger (`slides/ai-agent-skills-philosophy/index.html:43-47`, 지도 장 `:285,287`) | 해부도의 색을 어떻게 배정할지 | 패널 테두리는 망한 쪽이 흐릿한 색(dim), 잘된 쪽이 강조색(accent)이다. 부위 글자는 망한 쪽 dim, 잘된 쪽은 지도 장 행 이름과 같은 밝은 색(bright)이다. (구현 중 정정 — 행 이름 bright는 지도 장 문법이 정본이라 이를 따름) 층 원문자만 예외로 지도 장과 같은 색 규약(①③=accent, ④=danger)을 따른다. 규약을 어기면 지도 장과 색이 어긋나기 때문이다. 좌우 제목 두 줄은 기존 세 장과 같이 흐릿한 색(dim)을 유지한다. | 자체 해소 |
| 13 | "잘된 결과 / 망한 결과" 문구가 세 장에서 완전히 동일 (`slides/dx-vs-ax-automation/index.html:779-780`, `slides/ai-agent-skills-philosophy/index.html:164-165`) | 해부도의 좌우 제목을 무엇으로 쓸지 | 기존 문구 "망한 결과" "잘된 결과"를 그대로 쓴다. "결과물"로 어미를 바꾸지 않는다. | 자체 해소 |
| 14 | 2부 번호 규약: N=구조 장, Nb=동작 보기 장 (`slides/ai-agent-skills-philosophy/index.html:363,559` 외) | 2부 신설 장의 주석 번호를 어떻게 매길지 | 신설 장을 10번으로 한다. 기존 10~17번은 11~18번으로 민다. 9c 같은 접미 번호는 동작 보기 규약과 헷갈려 쓰지 않는다. | 자체 해소 |
| 15 | 1부에는 접미 번호 선례가 없음 (`slides/dx-vs-ax-automation/index.html:100-791` 주석 시퀀스) | 1부 신설 장의 주석 번호를 어떻게 매길지 | 신설 장을 8번으로 한다. 기존 8~16번은 9~17번으로 민다. | 자체 해소 |
| 16 | 대본의 번호·시간 결합 전수 목록 (docs/2026-08-seminar-script.md:3,4,15,19,42-66,71,121-162,169-177) | 대본에서 무엇을 함께 고칠지 | 고칠 곳은 여섯 갈래다. 1) 머리말의 덱 장수를 1부 17장, 2부 28장으로 고친다. 유인물 쪽수는 1부 17쪽, 2부 28쪽, 합계 45쪽으로 고친다. 2) 머리말 등식을 "1부 17:45 + 2부 29:30 = 47:15"로 갱신한다. 3) 부별 시간 헤더 2줄은 "약 18분" "약 30분"으로 고친다. 표기 규칙은 이번에 반올림으로 통일한다(기존 "약 28분"은 버림 표기였다). 4) 장 헤더 번호를 1부 9개, 2부 13개 민다. 5) 압축 경로의 장 번호 4곳을 고치고, 신설 2장 생략(−1:30)을 첫 항목으로 넣어 절감량을 −9:50으로 갱신한다. 6) 45분 안내 문장은 47:15에서 신설 2장 생략(−1:30)과 방법 5·6 훑기(−0:50)를 빼면 44:55가 된다는 내용으로 다시 쓴다. 보강 장 시간은 0:45를 유지한다. | 자체 해소 |
| 17 | 옛 보고서에 삽입 전 기준 슬라이드 주소가 남아 있음 (docs/blindspot/2026-08-20-serve-methods-and-review-report.md:16) | 옛 보고서의 슬라이드 주소를 고칠지 | 옛 보고서는 시점 기록이므로 그대로 둔다. 이번 사이클 보고서에 "옛 보고서의 슬라이드 링크와 장수 표기는 삽입 전 기준"이라는 각주를 남긴다. | 자체 해소 |
| 18 | 인라인 회색 각주는 인쇄에서 흐리게 남음 — 대비 2.58:1 실측 (edge-cases 인쇄 에뮬레이션) | 새 장의 하단 각주를 어떤 방식으로 칠할지 | 새 장의 각주는 `class="small dim"`을 쓴다. 이 조합은 인쇄에서 검정으로 복구된다. | 자체 해소 |
| 19 | opencode 공식 문서 갱신일 2026-08-19, 저장소는 anomalyco/opencode로 이전, 최신판 v1.18.18 (https://opencode.ai/docs/ , https://github.com/anomalyco/opencode) | 새 장의 사실 출처와 각주 문구를 어떻게 할지 | 새 장 각주는 "opencode 공식 문서 기준 (2026-08-19 확인)"으로 쓴다. 실행 버전 번호는 쓰지 않는다. 이 장의 사실은 실측이 아니라 문서 확인이기 때문이다. 기존 방법 5 장의 v1.17.18 각주는 실측 기록이므로 그대로 둔다. | 자체 해소 |
| 20 | 프로젝트 메모리에 장수·시간 수치가 저장돼 있음 (`/home/dkdlqoddi/.claude/projects/-home-dkdlqoddi-dkdlqoddi-github-io/memory/seminar-two-part-structure.md:13-23`) | 구현 후 어떤 기록을 함께 갱신할지 | 구현 후 프로젝트 메모리의 장수(17장/28장)와 시간(47:15) 수치를 갱신한다. | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 해부도 부위 10칸(좌 5 + 우 5)의 최종 문구 | 각 스킬 장의 요약 문장을 읽고 그림 폭 한도(13px 한글 약 33자) 안에서 다듬어야 한다. | 구현 시 확정하고, 병합 전 퀴즈로 확인한다. |
| 2 | 신설 2장과 보강 장의 실제 높이가 상한(660px/700px)을 지키는지 | 문구가 확정되어야 잴 수 있다. 높이 계산식(158 + 0.981 × 그림 세로값)은 확보됨. | 구현 직후 실측한다. |
| 3 | 방법 5·6 구간과 새 장 구간의 차이를 짚는 대본 문장 | 새 장 문구가 확정된 뒤에 자연스러운 연결 문장을 쓸 수 있다. | 대본 갱신 시 확정한다. |
| 4 | 기존 각주 6개가 인쇄에서 회색으로 남는 문제 | 이번 요청 범위 밖의 기존 조건이다. 새 장은 이미 안전한 방식을 쓴다. | 다음 인쇄 개선 사이클. |
| 5 | 숨은 설명문이 인쇄에서 빈 블록으로 남는 문제(2부 25곳, 1부 14곳) | 기존 조건이며 보이지는 않아 실해가 작다. 다만 신설 2장이 같은 조건을 2곳 더한다는 점은 기록해 둔다. | 다음 인쇄 개선 사이클. |

## 스캔 원본 요약

### conventions

- 1부 비코드 장 골격: `h3 → p.visually-hidden → svg.diag(viewBox 0 0 900 N) → (선택) p.small`. 로드맵 장은 마무리 문장을 SVG 안 `<text>`로 처리 (`dx:345-408`).
- 화살표는 `line/path + polygon` 수작업, `<marker>`/`<defs>` 0건. 귀환선 완성형은 2부 `path.march + stroke-dasharray` (`philosophy:714-718`). march 주기 불일치: 1부 `4,3/-14`(`dx:56-57`) vs 2부 `6,5/-22`(`philosophy:84-85`) — 복사 시 이음매 튐.
- 은하 배경 가독성: SVG 자유 텍스트 뒤 `rect fill="none"`(자동 어두운 받침판, 인쇄 자동 해제). 다각형은 `class="panel-fill"` 명시 (`dx:31`, `philosophy:35,316`).
- (B) 대상 장: fragment 0개 → 700px 상한. 요약 상자 CSS `font-size 0.62em, width 88%` (`philosophy:37-40`). 요약 상자 10곳 전부 li 3개, 마지막 `철학:`.
- 스킬 장 골격: `h2 → p.tool-tags → visually-hidden → svg.diag → div.summary-box`. 덱 순서 ponytail → grill-me → superpowers → blindspot-flow → fablize. fablize 배지는 `플러그인 · fivetaku` (`philosophy:581`).
- 인쇄 복구는 클래스 화이트리스트: deck-base는 `svg *`/`.eyebrow`/`pre`만, 2부 인라인이 `.tag`/`.meter`/`.term` 추가. `.summary-box`는 어디에도 없으나 reveal 자체 규칙(`.reveal li{color:#000}`)으로 글자는 검정화됨.
- 주석 형식: 6칸 들여쓰기 `<!-- ═══ N. 제목 ═══ -->`. 1부 auto-animate는 4↔5장뿐, 삽입 지점과 격리.

### similar-features

- 왕복(응답 귀환) 그림 전례 0건. 귀환 점선의 중립 사용례: `결과 취합`(`philosophy:925-928`), `관찰 → 다음 판단`(`:856-859`). 반려/실패 의미로는 danger 색과 결합 (`:226-228,:606-608,:715-718`).
- 가장 가까운 재사용 원형: 방법 1·5의 HTTP 사슬(선 y=32, 라벨 y=22 font-size 13, 종점 `사내 LLM` x=722 폭 155). opencode 상자에는 `march-border` 점선 테두리 관례 (`dx:553,591,630`).
- 좌우 2열 원형: DX와 AX 장(`dx:140-167`, 좌 x=40~290 / 우 x=610~860, 우열 accent fragment)과 지도 장(`philosophy:273-304`, 패널 x=50/470 폭 390, 행 피치 32, 배지 우측 정렬 x=360/400).
- 지도 매핑 정본: ponytail=①③, grill-me=①, superpowers=③, blindspot-flow=③④, fablize=④. ②도구 제한 담당 스킬 0개. 캡션 계약: "각 장의 배지가 이 지도를 가리킵니다"(`:306`) — 해부도도 같은 배지 체계를 쓰므로 캡션은 무변경.
- 정의문 정본 문형: `한글(영문): 정의 — 일상 비유` (`philosophy:232` 하네스 정의). 원어 병기 실례: `맹점(Blindspot)`(`:552`), `원형(archetype)`(`:723`).
- 연작 결속: `잘된 결과/망한 결과` 문구가 1부 브리지·2부 2~3장에서 완전 동일, 항상 dim. 미터 상호 주석(`dx:33-34` ↔ `philosophy:49`).

### integration-points

- 대본 재정렬: 1부 §8~16 → §9~17(9개), 2부 §15~27 → §16~28(13개). 신설 1부 §8, 2부 §15.
- 확정 갱신 목록에서 빠져 있던 것: 머리말 덱 장수(`script:3`)와 부별 실측 등식(`script:4` 17:00+28:45 → 17:45+29:30), 부별 시간 헤더 2줄(`script:19,71` — 현재 "약 17분"/"약 28분" → 목표 "약 18분"/"약 30분"), 압축 경로 장 번호 4곳(`:170,171,176,177`)과 절감량 헤더(`:169` −8:20 → −9:50; 결과 37:25/34:10으로 라벨 "약 37분/약 34분" 유지 가능), 45분 문장(`:4` — 한 항목으로는 산술 불성립, 2개 조합 필요).
- slides.json 무변경(방법 수 불변), 미터 aria-label 11개(1부 6 + 2부 5) 무변경, 두 삽입 지점 모두 auto-animate 짝과 격리 — 전부 확인 완료.
- `#/N` 참조의 범위 구분: 덱·랜딩의 하이퍼링크(href)에는 `#/N` 0건이라 링크는 안 깨진다. 반면 docs 문서의 본문 텍스트에는 재현 안내용 `#/11,#/12,#/13`이 실재(`serve-methods-and-review-report.md:16`)해, 그 보고서의 "저장소 내 참조 0건" 전제는 이제 성립하지 않는다.
- 해시 주소는 인덱스 기반(hash: true): 1부 index 7 이후, 2부 index 14 이후 밀림.
- 배지 이식 주의: `.tag`/`.tool-tags`는 2부 전용, 1부에 없음. `.travel-dot` keyframe은 `translateX(670px)` 하드코딩이라 재사용 불가.
- 저장소 밖 커플링: 프로젝트 메모리(16장/27장/45:45), 산출물 4종 세트 + 퀴즈 관례(`e5f08e6` 선례), 검증 대조는 17/17·28/28로 재실행.

### edge-cases

- (B) 실측: 현재 557px, 상한 700px(fragment 0), 여유 143px. li 한 줄 41px/두 줄 75px. 한 줄 정의 2개 추가 → 약 639px 안전. 두 줄 정의 2개면 산식으로 최소 707px(557+75×2)라 상한 초과 — 스캐너 보고값 774px는 산식과 어긋나나 "초과" 결론은 동일. 한 줄 용량: 한글 36자, `<strong>` 라벨이 길면 본문 여유 급감 → 라벨 축약 필수.
- 신설 장 높이식: 총 높이 = 158 + 0.981 × viewBox 세로값 (h3+svg+p.small 골격). 경계: viewBox 511 → 660px, 552 → 700px. h3 두 줄 꺾임 +65px, h2+tool-tags 조합은 h3보다 +40px.
- SVG 라벨: 자동 줄바꿈 없음, 최소 12px(11px 사용 0건), 한글 폭 0.826×font-size. 390폭 패널 실용 한도: 13px 한글 약 33자, 15px 약 28자. 받침판은 글자 폭의 약 1.36배.
- 인쇄: HTML 2단은 reveal 인쇄 규칙(0-2-2)이 무너뜨림 → SVG 단일 캔버스 필수. 인라인 `style="color:var(--secondary)"` 각주는 인쇄에서 회색(2.58:1) 잔존 → 새 장은 `class="small dim"`. `.tag`/`svg text`/`rect[fill=none]` 복구는 기존 규칙으로 충분.
- fragment·동작 축소: 축소 모드에서 fragment 정상 동작(전환만 즉시), march는 정지 — 추가 방어 불필요. fragment 인덱스는 장 로컬이라 충돌 개념 없음. 660px 규칙의 원근거(40px 이동)는 현 브라우저에서 재현 안 되나 계약으로 유지.

### domain

- opencode → provider는 AI SDK 기반 표준 HTTPS 직접 호출이 기본값. 프록시/사내 CA 지원이 간접 증거 (https://opencode.ai/docs/providers/ , /enterprise/ , /network/). 게이트웨이(Zen 등)를 끼우면 홉 추가 — "직접"은 조건부로 서술 (https://opencode.ai/docs/zen/).
- 사내 OpenAI 호환 LLM 연결 = npm 패키지 + baseURL + apiKey. `@ai-sdk/openai-compatible`=/v1/chat/completions, `@ai-sdk/openai`=/v1/responses (https://opencode.ai/docs/providers/).
- 요청/응답 뼈대는 공통(역할 붙은 대화 배열 → 텍스트 + 토큰 회계), 경로·헤더·필드명은 provider별 상이: OpenAI `/v1/chat/completions`+Bearer, Anthropic `/v1/messages`+x-api-key, Gemini `:generateContent` — 경로 일반화 금지 (각 공식 레퍼런스).
- 스트리밍 = 같은 HTTP 연결 위 SSE 단방향, WebSocket 아님 (MDN EventSource, OpenAI/Anthropic 스트리밍 문서, opencode chunkTimeout).
- 홉 혼동이 최대 함정: 사용자↔로컬 opencode 서버 SSE와 opencode↔provider SSE는 별개 스트림 (https://opencode.ai/docs/network/ — NO_PROXY 요구).
- 정의: unknown unknowns는 1960년대 미 국방 조달 기원, 2002년 Rumsfeld가 대중화 (https://en.wikipedia.org/wiki/There_are_unknown_unknowns). blindspot은 Johari 창의 blind area(남은 알고 나만 모름)로 특정하면 unknown area(아무도 모름)와 깔끔히 구분됨 (https://en.wikipedia.org/wiki/Johari_window).
- 저장소 이전: sst/opencode → anomalyco/opencode(구 URL 301), 최신 v1.18.18(2026-08-13), 문서 갱신일 2026-08-19.
