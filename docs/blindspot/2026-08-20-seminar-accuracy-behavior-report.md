# 세미나 내용 검증 + 동작 페이지 추가 작업 보고서

- 날짜: 2026-08-20
- 기준: main(HEAD 2d844d9) → 워킹트리 (이 보고서 포함 커밋 1건으로 반영 예정, 푸시는 퀴즈 통과 확인 후)
- 퀴즈: docs/blindspot/quiz/2026-08-20-seminar-accuracy-behavior.html — 통과 전 머지(푸시) 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '확인 장면 목록'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

세미나 두 자료의 내용을 공개 자료와 대조해 검증하고, 틀리거나 낡은 서술을 고쳤습니다. 가장 큰 정정은 이미 단종된 Copilot Workspace 소개를 후속 제품 Copilot Cloud Agent 기준으로 다시 쓴 것입니다. oh-my-opencode가 oh-my-openagent로 개명된 사실도 반영했습니다. 공식 명칭이 아닌 "LangChain Data Agent"는 LangChain Agent로 바로잡았습니다. 2부의 도구 열 개마다 실제 사용 장면을 한 줄씩 재생하는 "동작 보기" 페이지를 추가해, 2부가 17장에서 27장이 되었습니다(1부 14장 포함 전체 31→41장). 정정의 근거 출처는 구현 노트에 기록해 두었습니다(한 건인 ponytail만 세션에 로드된 스킬 원문 기준).

### 확인 장면 목록 (스크린샷 / 데모)

로컬 검증 캡처는 커밋에 제외되는 임시 폴더(.playwright-mcp/)에 있었습니다. 직접 보려면 저장소 루트에서 `python3 -m http.server 8000` 실행 후 http://localhost:8000/slides/ai-agent-skills-philosophy/ 를 여세요. 확인한 장면:

- 동작 보기 10장(터미널 재생: 고정폭 글꼴 · 역할색 · 한 줄 = 한 박자) — ponytail, superpowers, fablize 표본 육안 확인, 27장 전수 줄바꿈 0건 계측
- 정정된 다이어그램 장 — ponytail(7단 캡션), superpowers(워크트리 단계·태스크별 루프), Copilot Cloud Agent(계보 캡션), LangChain Agent(ReAct 루프), oh-my-openagent(에이전트/도구 층 분리), Devin(계획 검토 게이트·병렬 세션)
- 신규 제품명 3개를 지도·스펙트럼 두 장(대체텍스트 포함)에서 동기화, Devin 표기 "계획 승인 후 자율"로 통일
- 인쇄 에뮬레이션: 터미널 흰 배경 반전 + 줄 앞 기호(❯ ⛭)까지 검정 확인 · 동작 축소: 전환 정지 · 오프라인(file://): 27장 로드

### 리뷰 포인트 (개발자용)

- slides/ai-agent-skills-philosophy/index.html:55-75 — 터미널 재생 관용구 CSS. 크기는 잎(.term-bar/.t-line 각 0.58em=24.4px)에서만 지정(중첩 배율 금지), deck-base의 `.reveal p` 글꼴 강제를 더 높은 특이성 + !important로 우회하는 모노+Pretendard 스택.
- slides/ai-agent-skills-philosophy/index.html:101-105 — 터미널 인쇄 반전. `*`에 안 잡히는 의사요소(::before 마커)까지 검정으로 별도 지정.
- slides/ai-agent-skills-philosophy/index.html:361 이하 — 동작 보기 10장(각 도구 장 바로 뒤, fragment 줄 재생). fragment 총량 급증(11→87)은 발표자 통제를 위한 의도된 트레이드오프.
- slides/ai-agent-skills-philosophy/index.html:749, 820, 889 — 사실 정정의 핵심 3장(Copilot Cloud Agent 전면 재작성 · LangChain Agent 개칭 · oh-my-openagent 층 분리). 정정 근거 URL은 구현 노트 05:50 항목.
- slides/ai-agent-skills-philosophy/index.html:967 — Devin: Interactive Planning 게이트 + 병렬 세션. 지도(:295 부근)·스펙트럼(:672 부근)의 특성 표기도 "계획 승인 후 자율"로 동기화됨.
- slides/dx-vs-ax-automation/index.html — opencode.json 주석 1줄 정밀화 외 무변경. 공유 파일(shared/vendor/scripts/랜딩) 전부 무변경.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

(1) 두 덱의 모든 주장·명칭·구조 서술을 1차 출처와 대조해 정정 — 세미나 질의응답에서 반증당할 지점 제거. (2) "다이어그램만으로는 어렵다"는 피드백에 대해, 각 도구의 시간 축 동작을 fragment 단위 터미널 재생으로 보여주는 페이지를 도구당 1장 추가.

### 제약 (Constraints)

- 직전 사이클에서 승인된 1부/2부 흐름·모프 체인(data-id: req/band/d1~d12/L1~L4) 불변 — 실측으로 HEAD와 data-id 집합 동일 확인.
- 공유 파일 불변(deck-base.css ?v=1 유지). 터미널 관용구 CSS는 philosophy 덱 인라인에만 존재.
- 1차 출처로 확인 안 되는 수치(Copilot Workspace 단종 날짜, Devin 가격)는 슬라이드에 기재하지 않음.
- 애니메이션은 CSS 전환/키프레임만(SMIL·JS 금지), fragment는 발표자 키 조작으로만 진행.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 글자 하한(캔버스 24px) | 터미널 크기를 잎에서만 0.58em(24.4px)로 지정 — 중첩 배율로 19px까지 떨어졌던 초안을 정정 (실측 24.36px) |
| deck-base의 `.reveal p` 글꼴 !important 강제 | 더 높은 특이성(.reveal .term .t-line) + !important로 우회, 라틴 모노 + 한글 Pretendard 스택 (실측 적용 확인) |
| 흑백 인쇄에서 역할 구분 | `*`가 못 잡는 ::before 마커(❯ ⛭)까지 검정 지정 — 종이에서 기호로 역할 구분 유지 (에뮬레이션 실측 rgb(0,0,0)) |
| 줄바꿈으로 리듬 붕괴 | 긴 줄 7건 축약 후 27장 전수 계측 — 2줄로 접히는 t-line 0건 |
| 개요·상세 표기 불일치 | Devin "완전 자율"이 지도·스펙트럼에 잔존하던 것을 "계획 승인 후 자율"로 동기화 |
| 구 명칭 잔존 | grep 전수 — 남은 구 명칭은 계보·개명 서술 4곳뿐(의도된 표기), 주석 헤더 3곳도 정정 |
| PDF 내보내기 fragment 폭증 | pdfSeparateFragments:false로 줄 87개가 페이지를 늘리지 않음 — 페이지는 슬라이드 수와 같은 27장(증가분 10장은 새 장 때문) |
| 스펙트럼 라벨 배경 여유 | "Copilot Cloud Agent" 라벨 배경 사각형 190→220px 확대 |

### 검증 결과

- check-runner: 매니페스트·접근성·오프라인·공유 파일 무변경 등 전 항목 통과. 유일 실패였던 주석 헤더 구 명칭 3건은 즉시 정정 후 잔존 0건.
- change-analyzer 지적 9건 전부 반영: 글자 하한·모노 폰트 무력화·t-ai 규칙 부재·인쇄 마커·Devin 표기 잔존·라벨 여유·줄바꿈·표기 대소문자 통일·출처 미기록.
- Playwright 실측: 두 덱 41장(14+27) 넘침 0건 · 콘솔 오류 0건 · t-line 줄바꿈 0건 · 글자 24.36px · 모노 스택 적용 · 인쇄 마커 검정 · 동작 축소 전환 정지(1e-05s) · file:// 27장 로드.

### 의도적 범위 제외

- 발표 진행 키 입력 증가(총 ~114회): 동작 페이지의 발표자 통제(한 줄 = 한 박자)를 위한 의도된 트레이드오프. 빠른 이동은 조망(Esc)·번호 점프 사용.
- Devin Desktop 등 제품군 확장 서술: 클라우드 Devin에 한정(세미나 범위).
- 과거 사이클 보고서·퀴즈 속 옛 제품명: 이력 문서라 동결.
- aider의 저속 유지보수 상태를 슬라이드에 명기하는 것: "원형(archetype)" 재포지셔닝으로 갈음.

### 구현 노트 요약

docs/blindspot/seminar-accuracy-behavior-implementation-notes.md — 결정 7건. 핵심: 사이클 범위 해석(승인 구조 불변), 근거 원천 3원화(세션 스킬 원문 / 웹 리서치 2기), 터미널 재생 관용구 설계, 푸시 정책(퀴즈 통과 후), 정정 9건 판단(05:40), 동작 페이지 삽입·표지 문구 정합(05:41), 근거 출처 기록(05:50). 사용자 확인 필요 항목: 푸시 실행 여부(퀴즈 통과 확인 후) 1건.
