# 세미나 내용 검증 + 동작 페이지 추가 구현 노트

- 시작일: 2026-08-20
- 연관 문서: docs/blindspot/2026-08-20-seminar-flow-rebuild-report.md (직전 사이클), docs/blindspot/seminar-flow-rebuild-implementation-notes.md

<!-- 결정 시점마다 아래 형식으로 append. 사후 재구성 금지. -->

## 2026-08-20 05:00 — 사이클 범위 해석

- 결정: "재구축"을 흐름 재배열이 아니라 (a) 전 페이지 내용의 사실 검증·정정, (b) philosophy 덱에 도구별 "동작 보기" 페이지 추가로 해석. 직전 사이클의 1부/2부 흐름·모프 체인은 퀴즈 통과로 승인된 구조이므로 유지.
- 이유: 사용자 요구가 "옳은 내용인지 확인해서 수정" + "다이어그램만으로는 어려우니 애니메이션·동작 페이지 추가" 두 가지로 명시됨. 승인된 구조를 다시 흔드는 것은 요구에 없음.
- 검토한 대안: 전면 흐름 재설계(승인된 구조 파기 — 근거 없음).
- 보수적 선택 여부: 예 — 승인된 구조 보존.
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오

## 2026-08-20 05:01 — 사실 검증 방법: 근거 원천 3원화

- 결정: (a) 저장소 내부 도구(ponytail, blindspot-flow)는 이 세션에 로드된 스킬 원문(훅 주입 스펙, .claude/skills)을 근거로 검증. (b) 외부 제품(Aider, Copilot Workspace, Devin, LangChain)과 (c) 공개 오픈소스(superpowers, oh-my-opencode, grill-me, fablize, opencode CLI)는 domain-researcher 2기 병렬 웹 리서치로 검증. 사설·비공개 도구는 공개 근거가 없으면 사용자 서술(기존 덱 내용)을 유지하고 그 사실을 노트에 기록.
- 이유: 근거 없이 고치면 또 다른 오류를 만든다. 원천별 최적 검증 경로 분리.
- 검토한 대안: 전부 웹 리서치(저장소 내부 도구는 웹에 없음), 전부 자체 지식(컷오프 이후 변화 누락 위험).
- 보수적 선택 여부: 아니오
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오

## 2026-08-20 05:02 — 동작 페이지 설계: 터미널 재생 관용구

- 결정: philosophy 덱의 도구 10종 각각에 다이어그램 장 다음 "동작 보기" 장을 추가한다. 공통 관용구는 "터미널/대화 재생" — 창 틀(제목 막대) 안에서 실제 사용 장면의 줄들이 fragment로 한 줄씩 등장하고, 등장 시 짧은 슬라이드-인 전환을 준다. 역할별 색: 사용자 입력(bright ❯), AI 응답(기본색), 하네스 개입(accent ⛭), 실패/반려(danger ✗), 성공(accent ✓).
- 이유: "다이어그램만으로 이해 어렵다"의 해법은 구체 시나리오의 시간 축 재생. fragment 기반이라 발표자가 속도를 통제하고, reduced-motion·인쇄 방어는 기존 체계(전환은 CSS, fragment는 print-pdf에서 전부 표시)를 그대로 탄다.
- 검토한 대안: 자동 재생 타이핑 애니메이션(발표자 통제 불가·reduced-motion 처리 복잡), 동영상 삽입(파일 크기·오프라인 계약 위반), SVG 애니메이션 확장(추상성이 그대로라 문제 해결 안 됨).
- 보수적 선택 여부: 아니오
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오

## 2026-08-20 05:03 — 이번 사이클 푸시 정책

- 결정: 구현·검증·보고서·퀴즈까지 완료 후 main에 커밋만 하고, 푸시는 사용자의 퀴즈 통과 확인 후 실행한다.
- 이유: 직전 사이클의 "질문 없이 푸시" 지시는 그 사이클에 한정된 승인. 이번 지시에는 푸시 언급이 없고, MANDATE 5항(퀴즈 통과 전 머지 금지)의 기본값이 적용된다. 푸시는 라이브 배포라 비가역 외부 효과.
- 검토한 대안: 즉시 푸시(승인 범위 초과), 피처 브랜치(이 저장소 관행상 main 직커밋 + 게이트 확인이 기존 패턴).
- 보수적 선택 여부: 예 — 배포는 게이트 뒤로.
- 계획과의 이탈: 없음
- 사용자 확인 필요: 예 (보고 시점에 퀴즈 통과 확인 후 푸시 여부)

## 2026-08-20 05:40 — 리서치 결과에 따른 내용 정정 판단

- 결정: (a) Copilot Workspace는 단종(아카이브·서비스 URL 404) — 슬라이드를 후속 제품 Copilot cloud agent 기준으로 전면 재작성하고 전신은 계보 캡션으로만 남김. PR은 "자동 생성"이 아니라 "사람이 diff 확인 후 결정"으로 정정. sunset 날짜는 1차 출처 미확인이라 미기재. (b) "LangChain Data Agent"는 비공식 명칭 — "LangChain Agent"로 개칭, "라우터"를 "모델이 매 턴 도구를 고르는 ReAct 루프(create_agent)"로 정정. (c) oh-my-opencode → oh-my-openagent 개명 반영, Librarian/LSP/AST-Grep 3분할(범주 오류)을 에이전트 층(librarian·oracle·explore)과 도구 층(LSP 8종·ast-grep)으로 분리. (d) Devin: Interactive Planning(사람 계획 검토 후 자율 실행)·병렬 세션·머신 스냅샷 반영, "완전 자율" 표현 완화, 가격은 변동성 커서 미기재. (e) Aider: 자동 커밋(기본값)·--auto-test(기본 OFF) 단서·architect/editor 모드 추가, "원형(archetype)"으로 재포지셔닝. (f) superpowers: "바이브 코딩 차단"(비공식 표현) 제거, 공식 문구 "Mandatory workflows, not suggestions"로 교체, 워크트리 격리 단계와 태스크별 TDD·리뷰 루프 반영, Prime Radiant 표기 복원. (g) grill-me: Matt Pocock 커뮤니티 스킬로 출처 명시, 라운드형 질문+권장 답+무상태 특성 반영. (h) fablize: fivetaku/fablize 공개 플러그인으로 확인 — 게이트 단독 서술을 4중 구성(라우터·실행 관찰·게이트·조사 프로토콜)으로 확장. (i) ponytail: 세션에 로드된 스킬 원문 기준으로 3단 표현을 7단 사다리로 정정(다이어그램은 3마름모 압축 유지 + 7단 캡션 병기).
- 이유: domain-researcher 2기(출처 URL 포함)와 세션 내 스킬 원문 대조 결과. "옳은 내용인지 확인해서 수정"이라는 사용자 요구의 직접 이행.
- 검토한 대안: Copilot Workspace 슬라이드 삭제(계보 정보 손실), 이름만 바꾸고 구조 유지(oh-my의 범주 오류가 남음 — 기각).
- 보수적 선택 여부: 예 — 1차 출처로 확인 안 되는 수치(단종 날짜, Devin 가격)는 기재하지 않음.
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오

## 2026-08-20 05:41 — 동작 페이지 10장 삽입 완료 + 표지 문구 정합

- 결정: 도구 10종 각각의 다이어그램 장 바로 뒤에 터미널 재생 동작 페이지를 1장씩 삽입(2부 17장 → 27장). 표지의 "사용법 · 명령어 제외" 문구는 동작 장면 추가와 모순되어 "구조 한 장 + 실제 동작 장면 한 장"으로 교체.
- 이유: 동작 페이지 도입으로 표지의 범위 선언이 거짓이 되는 것을 방지.
- 검토한 대안: 표지 유지(내부 모순), 동작 페이지를 별도 부록 섹션으로 몰기(도구별 문맥 단절).
- 보수적 선택 여부: 아니오
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오

## 2026-08-20 05:50 — 정정 근거 출처 기록 (리뷰어 재검증용)

- 결정: 05:40 정정 9건의 1차 출처를 여기 남긴다. (a) Copilot Workspace 단종·후속: githubnext.com/projects (Archived), github.com/githubnext/copilot-workspace-user-manual (2025-09-02 아카이브), github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent, docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent. (b) LangChain: docs.langchain.com/oss/python/langchain/agents (create_agent), reference.langchain.com …/create_react_agent (deprecated 명시), docs.langchain.com/oss/python/langchain/sql-agent. (c) oh-my-openagent: github.com/code-yeongyu/oh-my-openagent ("previously oh-my-opencode"), 동 저장소 docs/reference/features.md (에이전트 11종·LSP 도구·ast-grep 스킬). (d) Devin: cognition.com/blog/devin-2 (Interactive Planning·병렬), docs.devin.ai/get-started/devin-intro, docs.devin.ai/onboard-devin/repo-setup (머신 스냅샷), cognition.com/blog/new-self-serve-plans-for-devin (가격 변동 → 미기재 근거). (e) Aider: aider.chat/docs/git.html (자동 커밋 기본), aider.chat/docs/usage/lint-test.html (--auto-test 기본 OFF), aider.chat/docs/usage/modes.html (architect), pypi.org/project/aider-chat (저속 유지보수 판단 근거). (f) superpowers: github.com/obra/superpowers ("Mandatory workflows, not suggestions", Prime Radiant), claude.com/plugins/superpowers. (g) grill-me: github.com/mattpocock/skills …/grill-me/SKILL.md (라운드형·권장 답·무상태). (h) fablize: github.com/fivetaku/fablize + README.ko.md (4중 구성). (i) ponytail: 이 저장소 환경에 로드되는 스킬 원문(세션 훅 주입 스펙, 7단 사다리) — 외부 URL 없음, 로컬 플러그인 캐시(~/.claude/plugins/cache/ponytail)로 확인 가능.
- 이유: change-analyzer 지적 — 출처 없는 정정은 다음 사이클에 재검증 비용을 되물린다.
- 검토한 대안: 슬라이드에 출처 각주 표기(발표 화면 오염 — 기각, 노트에만).
- 보수적 선택 여부: 아니오
- 계획과의 이탈: 없음
- 사용자 확인 필요: 아니오
