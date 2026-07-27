# cds-agentic-work 덱 비주얼 개편 작업 보고서

- 날짜: 2026-07-27
- 기준: main(4d8fedd) → feature/cds-deck-visual(ff388ed)
- 퀴즈: docs/blindspot/quiz/2026-07-27-cds-agentic-work-visual.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

7월 30일 발표 자료의 글을 크게 줄이고 그림과 등장 효과로 바꿨습니다. 발표 내용, 장 수(20장), 이야기 순서는 그대로입니다. 모든 장의 제목이 결론을 말하는 문장으로 바뀌었습니다. 글자가 커져서 발표장 뒷자리에서도 읽힙니다(이전 최소 8.9픽셀, 지금 최소 24픽셀). 그림 조각을 차례로 보여주는 단계 공개가 31회 생겨, 발표 중 누르는 횟수가 19회에서 50회로 늘었습니다 — 리허설이 필요합니다.

### 스크린샷 / 데모

- 로컬 미리보기: 저장소 루트에서 `python3 -m http.server 8000` 실행 후 http://localhost:8000/slides/cds-agentic-work/ 접속.
- 구현 검증 캡처(커밋 제외, 로컬 `.playwright-mcp/`): 표지·3~10장·13~16장·19장, 인쇄 에뮬레이션 2종, 조망 화면.
- 확인 포인트: 3장에서 화살표 키 3번 → 그림 조각 등장, 이어서 4·5장으로 넘기면 상자가 미끄러지며 그림이 자람. Esc는 전체 조망(미공개 조각 포함 표시).

### 리뷰 포인트 (개발자용)

- `slides/cds-agentic-work/index.html:139-148` — reduced-motion 차단 블록. `transition-delay: 0s` 추가와 auto-animate 주입 시트(특이성 0,2,0 + !important)를 이기는 0,3,0 규칙.
- `:150-170` — 인쇄 방어. 전 규칙 `!important` 전환, `svg, svg *` currentColor 수렴, `.cover-ship` display:none `!important`(기존 잠재 결함 수정).
- `:174` — 조망(Esc) fragment visibility 보정 한 줄.
- `:181-188` — SVG 다이어그램 시스템: `.diag`/`.dim`/`.bright` + `transform-box: fill-box`.
- `:265, 289, 319` — 3·4·5장 모핑 사슬(`data-auto-animate`, 상자 `data-id`, 5장 입구 조각은 `data-auto-animate-unmatched="false"`).
- `:674` — `pdfSeparateFragments: false` (전용 인쇄 20쪽 고정, 기본값이면 51쪽).
- 삭제된 클래스(`.diagram`/`.box`/`.link`/`.checks`) 잔존 참조 grep 확인 완료 — 0건.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

텍스트 과다(총 3,235자, em 중첩으로 최소 8.9px) 덱을 assertion-evidence 구조로 재표현: 제목=결론 문장, 본문=시각 근거 1개. 내용·순서·슬러그·랜딩 불변. 시각 수단은 인라인 SVG(인쇄 배치 보존·폭 고정) + reveal 코어 기능만(fragment 31개, r-stack 미사용으로 종결, auto-animate 3·4·5장).

### 제약 (Constraints)

- 비트맵/외부 리소스 0, 플러그인 0(발표자 노트 불가), 무채색 4단 팔레트, vendor 상대경로, file:// 동작 보장.
- 모션: 등장·단계 공개만(반복 금지), reduce 시 완전 정지(주입 시트 특이성 대응 포함).
- 뜻을 나르는 선은 대비 3:1 이상(#9aa0a6 이상)만. hairline #2a2b2a는 장식 전용.
- 글자 하한 캔버스 24px(0.58em). 컨테이너에 font-size 금지(중첩 곱 재발 방지).
- zoom 3장(13·17·18)은 auto-animate 금지(모핑이 zoom을 무조건 덮음 — disable-slide-transitions).
- SVG 색은 currentColor + .dim/.bright 클래스만. 하드코딩 hex는 인쇄 되돌림이 못 잡음(표지 우주선만 예외 — 인쇄에서 숨김).

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| ?view=print 쪽수 폭증(기본값이면 51쪽) | `pdfSeparateFragments: false`로 장당 1쪽, 실측 20쪽 확인 |
| Ctrl+P에서 커스텀 도형 소실 | 되돌림 전 규칙 !important + svg currentColor 수렴, 인쇄 에뮬레이션 실측(검정 확인) |
| Ctrl+P에서 표지 우주선 흰 얼룩 | reveal `.reveal div{display:block}`(0,2,2)가 이기던 기존 결함 — display:none !important로 수정 |
| reduce 사용자에게 모핑 재생됨 | (0,3,0)+!important 차단 줄 + transition-delay 0 — 강제 reduce 실측 |
| file:// replaceState 예외로 전환 영구 정지 | 헤드리스 크롬 file://+해시 실측 — 예외 없음, 콘솔 0건 |
| 조망(Esc)에서 미공개 fragment 빈칸 | visibility 보정 1줄. 부작용: 발표 중 Esc는 미공개 내용 노출(발표자 화면 없음) — 수용·문서화 |
| 모핑 unmatched 조각의 0.8s 페이드 리듬 불일치 | 5장 입구 2조각에 `data-auto-animate-unmatched="false"` |
| 세로 700px 넘침 | 전 장 scrollHeight 실측 — 최대 452px, 넘침 0건 |
| 화면낭독기: 미공개 fragment 텍스트 누출·aria-label 미낭독 | 전체 설명 선공개 정책(visually-hidden은 조각내지 않음) — 기존 관행 유지 |
| 해시 공유로 중간 단계 복원 | `fragmentInURL` 기본값 수용(사소, 1장 복귀 시 해시 제거됨) — 변경 없음 |

### 검증 결과

check-runner 전 항목 통과: slides.json 파싱·manifest-디렉터리 일치·.nojekyll·외부 리소스 0(xmlns만)·vendor 상대경로·viewport 금지어 없음·플러그인 참조 없음·비트맵 없음·대문자 취소 규칙·어둠 선언·워킹트리 클린·HTML 태그 균형(덱/랜딩/샘플 3파일). 실패 0건.
브라우저 실측(플레이라이트+헤드리스 크롬): 20장/31 fragment/모핑 3장/zoom 3장 구조 확인, 콘솔 오류 0, 전 장 세로 예산 통과, 인쇄 2경로·reduce·조망·file:// 동작 확인.

### 의도적 범위 제외

- 내용·구성 변경, 부록·핸드아웃(발표 전용 확정), 비트맵, 반복 애니메이션, 랜딩 변경, sample 역이식(다음 기회 — 아래 참조), 발표장 조명 대응(발표 전 실장비 확인 권고만), r-fit-text(한국어 keep-all 충돌로 금지).
- **sample 미역이식**: fragment·auto-animate·SVG 접근성·인쇄 !important 패턴은 이 덱에만 있다. 다음 덱 작성자는 sample이 아니라 이 덱을 참고해야 한다. 재사용 가치가 확인되면 sample 반영을 별도 작업으로.

### 구현 노트 요약

- 이탈 1건: 12장 "빈 그릇 SVG"를 큰 숫자 "0"으로 단순화 — 보고서 체크포인트에서 사용자 수용 확정.
- 발견 수정 1건: 표지 우주선 인쇄 노출(개편 전부터 잠재).
- 리뷰 수정 4건: SVG 회색 하드코딩 28곳 currentColor화, reduce transition-delay, unmatched 페이드 제외, 13장 칩 밝게.
- 실측 해소 1건: file:// 정상(unknowns 미해소 2번 종결).
- 단계 최종 31회(예산 40 이내).
