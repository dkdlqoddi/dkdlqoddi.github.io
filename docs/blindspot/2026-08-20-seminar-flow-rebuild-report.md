# 팀 세미나 흐름 재구축 (dx-vs-ax 1부 + philosophy 2부) 작업 보고서

- 날짜: 2026-08-20
- 기준: main(HEAD ebfa599) → 워킹트리 (커밋 1건으로 반영 예정)
- 퀴즈: docs/blindspot/quiz/2026-08-20-seminar-flow-rebuild.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

팀 세미나를 위해 발표 자료 두 벌을 1부와 2부의 연작으로 다시 구성했습니다. 1부(DX vs AX)에는 여정 지도, 긴 꼬리 차트, 폭 확산 브리지 세 장이 새로 들어갔습니다. 2부(AI Agent Skills Philosophy)에는 오늘의 지도, 자율성 스펙트럼, 정리 세 장이 새로 들어갔습니다. 그중 오늘의 지도는 기존 두 연속 장면 뒤에 이어 붙어 세 장짜리 연속 장면을 완성합니다. 두 자료의 마지막 장에는 서로로 이동하는 연결 고리가 생겼습니다. 자료를 PDF로 내보낼 때 실패 표시와 처리 표시가 같은 자리에 겹쳐 찍히던 결함을 찾아 고쳤습니다. 흑백 인쇄에서도 단계 표시기의 현재 칸이 보이도록 반전 표시로 바꿨습니다.

### 확인 장면 목록 (스크린샷 / 데모)

로컬 검증 캡처는 커밋에 포함되지 않는 임시 폴더(.playwright-mcp/)에 있었습니다. 직접 보려면 저장소 루트에서 `python3 -m http.server 8000` 실행 후 http://localhost:8000/slides/dx-vs-ax-automation/ 과 http://localhost:8000/slides/ai-agent-skills-philosophy/ 를 여세요. 확인한 장면:

- 1부: 표지(PART 1/2), 여정 지도(신설), DX 파이프라인(흐르는 점), AX 진화(피드백 루프 행진), 긴 꼬리 차트(신설, ✗→✓ 교차), 사다리(단계 공개), 방법 1·4(추상화 미터), 비교표, 브리지(신설, 폭 확산 + 2부 예고)
- 2부: 표지(PART 2/2), 폭 확산 → 조임(기존 두 장) → 오늘의 지도(신설) 모프 3연속, 스킬 5장(층 배지), 자율성 스펙트럼(신설), 제품 5장(자율성 미터), 정리(신설)
- 랜딩: 갱신된 1부/2부 카드 설명(slides.json), 1280×800 겹침 없음

### 리뷰 포인트 (개발자용)

- slides/dx-vs-ax-automation/index.html:31 — 컨테이너 도형 일괄 어두운 채움 규칙(rect/circle fill="none" + .panel-fill). 향후 투명 도형은 fill="transparent"로 회피(주석 참조). 동일 규칙이 2부 :35에도 중복.
- slides/dx-vs-ax-automation/index.html:81 — ?print-pdf 내보내기에서 fade-out fragment(✗)를 숨겨 ✓와의 좌표 겹침을 차단. reveal 6.0.1의 pdfSeparateFragments:false 분기가 fade-out을 남기는 동작에 대한 방어.
- slides/dx-vs-ax-automation/index.html:71 — 흑백 인쇄에서 미터 현재 칸 반전(배경 검정·글자 흰색). 색 소실 시 정보 보존.
- slides/dx-vs-ax-automation/index.html:288-339 — 신설 긴 꼬리 차트(fade-out/fade-in 같은 인덱스 교차, draw-on-visible 선 그리기).
- slides/ai-agent-skills-philosophy/index.html:102-277 — 모프 3연속 체인. data-id 계약: req/band/d1~d12는 모프 세 장 전체, L1~L4는 모프 2/3·3/3 두 장(:143, :207) — 이름 변경 시 모프 파손.
- slides/ai-agent-skills-philosophy/index.html:506-553 — 자율성 스펙트럼(제품 5, fragment 순차 공개). 이후 제품 장 순서와 미터 값이 이 축과 일치해야 함.
- 두 덱 끝 장의 교차 링크 — 슬러그가 양방향 계약이 됨. slides.json 검사로는 잡히지 않으므로 폴더명 변경 금지.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

opencode 기본 동작을 아는 팀 청중에게 (1) LLM 자동화의 효과(1부)와 (2) 하네스의 효과(2부)를 시각 중심으로 전달하는 단일 세미나 서사. 1부 브리지(위임 → 폭 확산)가 2부 첫 내용 장(표지 다음, 모프 1/3 "같은 요청, 벌어지는 결과")으로 직결되는 구조.

### 제약 (Constraints)

- 공유 파일 불변: slides/shared/(deck-base.css ?v=1 유지), vendor/, scripts/, 랜딩 코드 3종(index.html · styles.css · main.js) 미수정 — 데이터 파일인 slides.json의 설명 2건만 수정. 애니메이션·미터 유틸 CSS는 두 덱 인라인에 의도적 중복(~40줄) — 한쪽 수정 시 동기화 필요.
- 애니메이션은 CSS 키프레임만(SMIL·JS 금지) — deck-base의 prefers-reduced-motion 방어가 CSS만 정지시키기 때문.
- 슬러그 불변(공개 URL + 신설 교차 링크의 양방향 계약).
- 모든 SVG: currentColor 체계, role="img" + aria-label + visually-hidden 설명, xmlns 명시.
- EVA VIEW 700px 예산 내 배치(전 슬라이드 실측 통과).

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| prefers-reduced-motion: reduce | deck-base 전역 킬스위치 + 장식 점은 기본 opacity 0 → 정지 시 완전 비표시 (에뮬레이션 실측: duration 1e-05s) |
| 브라우저 인쇄(Ctrl+P, 흰 종이) | 채움 해제·SVG 검정 복구·장식 숨김·미터 현재 칸 반전 (에뮬레이션 실측) |
| PDF 내보내기(?print-pdf) | fade-out(✗) display:none → ✓만 내보냄 (실측: html 클래스 reveal-print 확인) |
| file:// 오프라인 열람 | 두 덱 모두 Reveal 초기화·다크 배경·콘솔 오류 0 (실측) |
| 모프 체인 역방향 탐색 | 4→3→2→3→4 왕복 정상, 오류 없음 (실측) |
| 은하핵 위 텍스트 | rect/circle[fill="none"]+.panel-fill 0.85 어두운 채움 + 라벨 배경 사각형 |
| 좁은 화면 랜딩(1024×768) | 겹침 발생 자체는 HEAD와 동일한 기존 한계로 판정(A/B 실측). 가로 겹침 시계열: 11px(HEAD) → 37px(긴 설명 도입 시점) → 22px(설명 축약 후 최종) — HEAD 대비 11px 늘었으나 카드 폭 140px 대비 미미. 근본 수정은 범위 제외 |
| 낭독기 | 미터 p 요소에 role="img" 부여(문단 aria-label 금지 규격 회피), 도형은 기존 규약 유지 |

### 검증 결과

- check-runner: 점검 10항목 전부 통과(CLAUDE.md 표준 2종 + 덱 규약 8종) — slides.json JSON 유효, dir↔index.html 4/4, .nojekyll 존재, 외부 리소스 0건, viewport 안전, color-scheme 존재, 링크 순서 계약 준수, role="img" 전수 aria-label, 플러그인 참조 0건, shared/vendor/scripts 무변경.
- Playwright 실측(1280×800): 두 덱 31장 넘침 0건·콘솔 오류 0건(three.js 안내 경고 1건은 vendored 기존 사항), 슬라이드별 스크린샷 육안 검토 3회 반복 후 수정사항 0으로 수렴, reduced-motion·print·print-pdf·file:// 4개 경로 실측 통과.

### 의도적 범위 제외

- 랜딩 1024×768 카드 겹침의 근본 해결(배치 알고리즘 또는 .card-desc line-clamp — styles.css ?v= 범프 필요): 기존 한계로 별도 작업 제안.
- deck-base.css로의 유틸 승격(중복 해소): 타 덱 3종 재검증 비용으로 보류.
- SVG 라벨 크기의 하한 미달: deck-base.css가 문서화한 하한은 960×700 캔버스 기준 24px인데, svg.diag(화면 92% 폭, viewBox 900) 안의 12px 라벨은 캔버스 환산 약 11.8px로 절반 수준 — 저장소 기존 관행이라 유지하고, 11px 신규분만 12px로 상향(현재 두 덱에 11px 잔존 0건).
- integrated-architecture / design-ax-transition 덱: 이번 세미나 범위 밖, 미수정.

### 구현 노트 요약

docs/blindspot/seminar-flow-rebuild-implementation-notes.md — 결정 11건. 핵심: 무질문 자율 모드(사용자 지시), 통합 덱 미신설(URL 계약), CSS 전용 애니메이션, 공유 파일 불변(중복 감수), 검증 루프 발견 결함 수정(은하핵 가독성·PDF fade-out 겹침·미터 인쇄/ARIA), 랜딩 겹침 기존 한계 판정. 사용자 확인 필요 항목: 없음 (전부 가역적 자체 해소, 이 보고서와 퀴즈로 노출).
