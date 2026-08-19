# philosophy 덱 리뷰 + 하네스(harness) 결과물 폭 시각화 Unknown Unknowns

- 날짜: 2026-08-20
- 입력: `docs/blindspot/2026-08-19-philosophy-harness-viz-requirements.md`
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 업계 문서가 검증 루프를 하네스의 가장 중요한 층으로 규정 (code.claude.com/docs/en/best-practices, claude.com/blog/building-agents-with-the-claude-agent-sdk) | 확정된 3층에 빠진 "검증 루프"를 그림에 어떻게 반영할지? | 층을 4개로 늘린다. 4층은 지시문, 도구 제한, 작업 절차, 검증 루프다. | 사용자 |
| 2 | `index.html:421` hash:true + 전 섹션 id 부재, 수용 선례 `docs/blindspot/2026-07-28-sample-backport-report.md:53` | 슬라이드 2장을 끼우면 공유된 번호 주소가 2칸 밀리는데 어떻게 할지? | 밀림을 그대로 받아들인다. 과거 sample 덱 때와 같은 처리다. | 사용자 |
| 3 | 이 덱만 마무리 장 부재 (`index.html:376-414` 직후 종료), 타 덱 4개는 보유 | 마무리 장을 이번에 추가할지? | 추가한다. 총 슬라이드는 14장이 된다. | 사용자 |
| 4 | edge F9: 캔버스 960×700, 기존 틀 소비량 약 601px, 여유 99px. EVA 가드 `deck-base.css:165-170`. 새 틀 = h3 + svg.diag | 새 2장을 기존 틀(제목+500px 상자+요약 상자)에 넣을지, 가벼운 틀로 갈지? | 가벼운 틀로 간다. 제목 글과 그림만 남기고 요약 상자는 쓰지 않는다. 정의·경고 같은 설명 글줄은 그림 밖 본문 문단에 둔다. | 자체 해소 |
| 5 | similar F11·conventions F8: 두 장 짝은 반드시 같은 좌표계 필요. 정본 viewBox 900은 `slides/sample/index.html:100,133`, 정본 그림 폭 92%는 `deck-base.css:85` | 새 2장의 그림 좌표계를 정본(900)과 덱 관례(700) 중 무엇으로 할지? | 정본 900 좌표계를 쓴다. 두 장은 서로 같은 좌표계로 맞춘다. | 자체 해소 |
| 6 | 덱 본문이 fablize를 "검증 하네스(Harness)"로 소개 (`index.html:127`) | 실제 예시 스킬을 무엇으로 확정할지? (원래 후보는 ponytail) | fablize로 바꾼다. 새로 넣는 검증 루프 층과 용어가 이어져 뒤 슬라이드 이해를 돕는다. | 자체 해소 |
| 7 | edge F5: `.accent` 계열은 색(color)만 정하고 채움(fill)을 정하지 않음 (`deck-base.css:87-90`). 치환형: fill/stroke→currentColor + 클래스는 `<g>` 묶음 우선 | 색 45곳을 어떤 방식으로 바꿀지? | 두 단계로 바꾼다. 색 값을 글자색을 따라가게 바꾸고, 어떤 색 계열인지 이름표를 단다. | 자체 해소 |
| 8 | edge F4: `#c62828`(6곳)은 팔레트에 없는 색. `--danger`는 `#f05050` (`deck-base.css:19`). 대비 3.43:1 → 5.48:1 | 빨강 계열이 밝은 산호색으로 바뀌는 것을 수용할지? | 수용한다. 글자 대비 기준 미달을 고치는 의도된 색 변경으로 보고서에 남긴다. | 자체 해소 |
| 9 | edge F1·F2: 실제 화살촉은 32개(참조 15곳). 대각선 3개는 각도 계산 필요. 그룹에 걸린 선 굵기가 폴리곤을 오염 | 화살촉 32개를 어떻게 바꿀지? | 전부 다각형으로 손수 바꾼다. 선 굵기는 각 선으로 내리고, 다각형은 채움색만 준다. 일괄 치환 스크립트는 쓰지 않는다. | 자체 해소 |
| 10 | edge F3: 마커 색이 선 색을 안 따라가 빨강·청록 선의 촉이 지금 회색. `:189`는 촉이 반대 방향 | 기존 화살촉의 색·방향 결함을 어떻게 처리할지? | 촉이 선 색을 따르게 하고, 되돌아오는 화살표는 목적지를 향하게 고친다. 화면이 달라지는 점은 보고서에 남긴다. | 자체 해소 |
| 11 | similar F7·F6: sample 주석이 병용 규칙 명시, dx는 `unmatched="false"` 선례. edge F8: 조망 모드에선 두 장이 나란히 보임 | 새 2장에 단계 공개(fragment)를 섞을지, 제목을 같게 할지? | 단계 공개는 쓰지 않고 둘째 장은 처음부터 완결 상태로 그린다. 제목은 두 장을 다르게 지어 목록 화면에서 구분되게 한다. 짝 없는 요소의 자동 흐림은 끈다. | 자체 해소 |
| 12 | domain D5·D6·D7: 실선 경계는 "그 밖은 절대 없음"으로 오독됨. 점 표시가 비전문가 이해를 개선 (dl.acm.org/doi/10.1145/3173574.3173718 외) | 결과물 폭을 어떤 시각 문법으로 그릴지? | 점 산포와 밴드를 함께 쓴다. 점 하나는 같은 요청의 한 번 실행 결과다. 밴드 가장자리는 흐리게 처리한다. 위쪽에 "잘된 결과", 아래쪽에 "망한 결과" 라벨을 단다. | 자체 해소 |
| 13 | domain D1·D7: "원하는 결과만 나온다"는 과장. 좁힌 뒤에도 폭과 꼬리가 남아야 정확 (claude.com/blog/building-verification-loops-in-claude-code-with-skills) | 좁아진 뒤 상태를 어떻게 그려야 정확할지? | 좁아진 밴드에도 폭을 남기고 바깥 점 몇 개를 남긴다. 문구는 "원하는 결과가 더 자주 나온다"로 쓴다. | 자체 해소 |
| 14 | domain D4: 과잉 규칙은 역효과, 탐색 작업은 일부러 넓게 둠 (code.claude.com/docs/en/best-practices) | "좁을수록 좋다"는 오독을 어떻게 막을지? | 둘째 장에 경고 한 줄을 넣는다: 탐색이 필요한 일은 일부러 넓게 둔다. | 자체 해소 |
| 15 | domain D2: 지시문은 어길 수 있는 연성 제약, 도구 차단은 못 어기는 경성 제약 (openai.com/index/introducing-structured-outputs-in-the-api) | 성격이 다른 제약들을 같은 그림 문법으로 그릴지? | 다르게 그린다. 지시문과 작업 절차는 폭을 미는 표현으로 그린다. 도구 제한은 자르는 선 표현으로 그린다. 검증 루프는 어긋난 결과를 되돌려 보내는 문 표현으로 그린다. | 자체 해소 |
| 16 | domain D8: 국내 관행은 "하네스" 음차 + 첫 등장 정의 (selectstar.ai/blog/insight/about-harness-engineering). 요구사항 개정 6에 용어 확정 기록 | 화면에 쓸 한국어 용어와 비유를 무엇으로 할지? | "하네스"로 쓰고 첫 등장에 한 줄 정의를 붙인다. 신입사원과 회사 업무 환경 비유는 말과 글 한 줄로만 쓴다. 그림 자체는 작동 구조만 그린다. | 자체 해소 |
| 17 | integration F6: 덱 인쇄 규칙이 그림 내부 전체를 강제 표시. 정본은 그림 앞 숨김 문단 (`slides/sample/index.html:99`). 그림 내부 title/desc 태그 금지 | 그림 설명을 어떤 형식으로 넣을지? | 그림 바로 앞에 눈에 보이지 않는 설명 문단을 둔다. 그림 안에 설명을 넣는 방식은 쓰지 않는다. | 자체 해소 |
| 18 | integration 스캔(스테일 문서 항목): 과거 문서·퀴즈에 "11장", 옛 순서 목록이 박혀 있음 | 슬라이드 수가 바뀌면 과거 문서들도 고칠지? | 고치지 않는다. 과거 문서는 당시 기록으로 동결한다. 최신 순서는 다음 단계의 설계 문서가 담는다. | 자체 해소 |
| 19 | conventions F7: 사용처 없는 스타일 규칙 2개(.llm-node, .user-node). 요구사항 개정 5에 부수 정리로 기록 | 죽은 스타일 규칙을 지울지? | 지운다. 사용처가 0곳이라 위험이 없다. | 자체 해소 |
| 20 | integration 스캔(git 상태 항목): main 브랜치가 곧 배포. 저장소에 미커밋 변경 없음 | 작업을 어느 가지(branch)에서 할지? | 새 작업 가지를 만들어 작업한다. 병합은 퀴즈 통과 후에만 한다. | 자체 해소 |
| 21 | edge F11: 자동 검사 도구가 전무. 상세 명령은 스캔 원본 요약의 edge 항목 참조 | 병합 전에 무엇을 확인할지? | 검사 목록을 고정한다.<br>· 옛 화살촉 방식의 흔적이 0건인지 (참조와 정의 모두)<br>· 직접 지정한 색이 0건인지<br>· 그림 수와 그림 설명 수가 같은지<br>· 슬라이드가 14장인지<br>· 덱 목록 파일이 규칙에 맞는 형식인지<br>· 브라우저로 전체를 넘겨 보며 눈으로 확인 (목록 화면과 인쇄 미리보기 포함) | 자체 해소 |
| 22 | edge F6·F7, `deck-base.css:92,189,198`: 모핑 방어 규칙이 공유 파일에 완비, dx 덱 실전 선례 존재. 모핑 짝 표시(data-id)는 svg 내부 `<g>`에만 | 첫 애니메이션 도입이 기존 설정과 충돌하지 않는지? | 충돌하지 않음을 확인했다. 공유 파일 수정도 필요 없다. 움직임을 이어줄 표시는 그림 안 묶음에만 붙인다. | 자체 해소 |
| 23 | similar F4: 모핑은 크기 변화를 늘림(scale)으로 흉내 내서 글자·선이 함께 찌그러짐 | 폭이 줄어드는 모핑을 어떤 요소로 구현할지? | 찌그러짐이 없는 방식으로 구현한다. 글자가 든 상자는 늘림 대상에서 빼고, 경계와 점의 이동으로 폭 축소를 표현한다. | 자체 해소 |

## 미해소 항목

1·2번은 이번 작업 범위 밖이라 다음 사이클로 미룬 항목이다. 3번은 범위 안의 세부 사항을 구현 중에 확정하는 항목이다.

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 기존 10장의 그림 글자가 기준의 절반 크기다(실효 약 10.5px). 함께 키울지? | 글자를 키우면 10장 전부 배치를 다시 잡아야 해서 이번 범위를 넘는다. | 다음 리뷰 사이클 |
| 2 | 기존 10장의 그림을 정본 좌표계(900)로 통일할지? | 이번 범위는 색·화살촉·설명문 결함 수정까지다. 좌표계 통일은 전면 재작업이다. | 다음 리뷰 사이클 |
| 3 | 아주 짧은 화살표의 촉 크기를 얼마로 통일할지? | 화면을 띄워 봐야 판단 가능한 미세 조정이다. | 구현 중 확인 |

## 스캔 원본 요약

### conventions

- Reveal 설정 `index.html:420-427`: `hash:true, transition:'fade', center:true, pdfSeparateFragments:false`, autoAnimate 전역 옵션 없음(기본값 duration 1s).
- head 계약 완비: viewport 안전(:5), color-scheme(:7), 링크 순서 black.css→deck-base.css?v=1→인라인(:11-19), galaxy canvas(:50), code-copy(:417-418). deck-base.css 수정 불필요 → `?v=` 범프 불필요.
- reveal 6.0.1 `autoAnimateStyles`에 fill/stroke 없음 → 색 트윈은 `color`+currentColor로만 가능. `deck-base.css:92` transform-box:fill-box가 SVG data-id 요소 보정.
- 정본 클래스는 후손 선택자 `.reveal svg .accent { color: ... }` — svg 루트에 클래스 달면 무효. `<g class>` 묶음이 관례(dx-vs-ax:88-90).
- 색 인벤토리 45곳 확정: `#00dddd`×37(→.accent, 동일값), `#9aa0a6`×2(→.dim, 동일값), `#c62828`×6(→.danger #f05050, 값 변경·대비 개선).
- 화살촉: marker 정의 1곳(:262), marker-end 14 + marker-start 1(:189), 실 화살촉 32개(수평20+좌향2+수직6+대각3+역방향1). marker 내부 currentColor는 선 색을 따르지 않음(현재 회색 촉).
- 덱 인라인 스타일: `.dim/.bright` 재정의(무해), `.llm-node/.user-node` 죽은 규칙, `svg{font-size:14px}` 기준 실효 라벨 10.5~11.9px(기준 24px 미달), 로컬 print 규칙 `svg *{display:block!important}`(:37-39).
- 덱 SVG는 고정 700×N + height:500px flex 래퍼, `class="diag"`/xmlns 미사용 — 정본(diag 92%, viewBox 900)과 좌표계 상이.

### similar-features

- 복사 가능 선례 2건: sample(:97-151, data-id 3쌍, rect 폭 220→180 축소 모핑 실증) / dx-vs-ax(:81-166, 7쌍, `unmatched="false"`, 클래스 교체로 색 모핑). design-ax(:104-143)는 data-id 0건·viewBox 불일치로 참조 금지, integrated(:652)는 고아 마크업.
- reveal 6.0.1 모핑 메커니즘: bbox 차이를 `transform: translate+scale !important`(origin top left)로 주입. rect width 변화는 scaleX → 내부 text·stroke 왜곡. viewBox≠렌더폭이면 translate 수 % 오차.
- 짝 규칙: `[data-id]` → 제목/문단 textContent 완전일치 → src. 문구 같은 텍스트는 의도치 않게 짝이 됨. 텍스트 짝은 scale:false.
- sample 주석 명시: 모핑 장 쌍에서 `data-transition="zoom"` 무시됨. fragment+auto-animate 병용은 sample이 실증(문제 시 unmatched="false").
- 인쇄: fragment에 `transform:none!important` → fragment 위치를 transform으로 잡으면 종이에서 무너짐, 좌표는 x/y로. 섹션당 1페이지(page-break-after) → 짝은 2쪽로 각각 온전.
- 개념도 배치 선례: design-ax harness 장(:140-183) — 좌측 3층 라벨, 중앙 수렴, 우측 출력, 하단 캡션. 색 하드코딩·text 내 `<br>` 결함은 복제 금지.
- 모핑 포기 선례: dx 리포트 "이전 상태 소실로 흐름 비교 곤란" — B 장에 A의 잔상(고스트) 필요성의 근거.

### integration-points

- 랜딩·slides.json·shared CSS·code-copy 전부 무접촉(랜딩은 덱 루트만 링크, main.js:35; 덱에 pre>code 0건). @view-transition은 deck-base.css:78-80이 공급.
- 인쇄 두 경로: Ctrl+P는 `html:not(.print-pdf)` 검정 복구(currentColor만) 적용 → 클래스 치환으로 자동 해결. `?print-pdf`는 어두운 화면 그대로(의도) + 섹션당 1쪽.
- EVA 가드(deck-base:164-174)는 클리핑 아닌 내부 스크롤 — 스크롤 발생 시 center:true의 bbox 측정 오염 → 모핑 튐. 새 장 내용 높이 700px 이내 필수.
- `#arrow` 참조 15곳 + 정의 1곳: polygon 전환 시 marker-end/start 속성 제거 동반 필수. `:189` marker-start는 방향 역전 케이스.
- git 상태 깨끗(main), 다른 세션 pending diff 없음. patch.py류 일괄 치환은 과거 사고 원인으로 문서화(수동 편집).
- 스테일 문서: plugin-reorder-explainer(순서 목록), quiz("11장"), 원본 report("총 10가지") — 동결 결정.

### edge-cases

- 화살촉 전수: 그룹별 촉 수 82→5, 117→2, 121→1, 150→2, 154→1, 183→3, 189→1, 221→3, 257→3, 294→4, 326→1, 329→1, 360→3, 398→1, 401→1 = 32. 대각 3건 각도: :296 −32.0°, :298 +32.0°, :121 218.7°(베지어 끝접선).
- 폴리곤 함정: 그룹 stroke-width:2 상속 → 촉 비대. fill 기본 black → currentColor 누락 시 검은 삼각형. 정본: stroke는 line에, polygon은 fill만(dx:91-92).
- `transition:'fade'`와 모핑 충돌 없음(reveal이 `disable-slide-transitions`로 자체 차단). 동작 축소는 deck-base:189(0-3-0 선택자)가 즉시 스냅 처리.
- 조망 모드: 모핑 판정 자체를 건너뜀 → 정적 썸네일 2장. 기술 문제 없음, 편집상 유사성만.
- 레이아웃: 캔버스 960×700 고정(4:3/16:9는 여백만 변화). 기존 틀 소비 601px, 여유 99px. flex 래퍼에 min-height:0 부재 → SVG 고유 크기 밑으로 안 줄어듦.
- `.visually-hidden`은 deck-base:93 정의, 인쇄에서도 숨김 유지. role="img"가 하위 트리를 낭독기에서 감춤 → aria-live 불필요. word-break:keep-all은 deck-base:46 전역.
- 검증 세트 제안: url(#arrow) 0, `<marker` 0, `(fill|stroke)="#` 0, svg 수=visually-hidden 수, `<section` 14, json.tool, 브라우저 순회(O키+Ctrl+P 포함).

### domain

- D1 "더 자주, 더 가깝게"가 상한(Anthropic 원문) — 결정론·무오류 함의 금지. https://claude.com/blog/building-verification-loops-in-claude-code-with-skills
- D2 연성(프롬프트/스킬: 확률 기울임) vs 경성(권한/훅/스키마: 절단) — OpenAI 구조화 출력 93%→100% 사례. https://openai.com/index/introducing-structured-outputs-in-the-api/
- D3 검증 루프가 최중요 층(Anthropic best practices 단독 최상위 팁) → 사용자 결정으로 4층 채택. https://code.claude.com/docs/en/best-practices
- D4 좁을수록 좋다는 오류: 과잉 규칙 역효과, 의도적 넓힘, 다양성 붕괴(RLHF mode collapse), 스캐폴드가 성능 깎은 실측(GAIA −23%p). https://arxiv.org/html/2606.08529
- D5 실선 경계의 containment 오독(허리케인 콘 연구) → 가장자리 페이드 + 축 라벨. https://journals.ametsoc.org/view/journals/bams/88/5/bams-88-5-651.xml
- D6 점 기반 표현(quantile dotplot, HOPs)이 비전문가 판단 개선 — 발표 매체는 HOPs 사용 가능한 드문 매체. https://dl.acm.org/doi/10.1145/3173574.3173718
- D7 넓은 밴드에 상단(대박)·하단(재작업) 라벨 병기, 좁힌 뒤 잔여 폭·꼬리 유지(결정론 함의 방지, temperature 0도 비결정 실측). https://arxiv.org/pdf/2408.04667
- D8 한국어 "하네스" 음차 표준, 신입사원/업무환경 비유가 4층 대응에 최적. https://selectstar.ai/blog/insight/about-harness-engineering/
