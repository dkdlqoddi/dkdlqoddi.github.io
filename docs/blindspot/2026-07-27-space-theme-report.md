# 우주 유영 테마 리디자인 작업 보고서

- 날짜: 2026-07-27
- 기준: main(aa9b88a) → feature/space-theme(899202e)
- 퀴즈: docs/blindspot/quiz/2026-07-27-space-theme.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

사이트의 모든 화면이 검은 우주 테마로 바뀌었습니다. 첫 화면, 발표 자료 두 개, 404 페이지가 같은 색 체계를 씁니다. 흰 별이 아주 천천히 흐르고, 흰 우주선이 첫 화면과 발표 표지에서 떠다닙니다. 내용 슬라이드에는 우주선을 일부러 넣지 않았습니다. 발표 중 집중을 방해하지 않기 위해서입니다.

한글 글꼴 Pretendard(프리텐다드)를 사이트 안에 담았습니다. 외부 서버에서 받지 않으므로 인터넷 없이 열어도 똑같이 나옵니다. 대신 처음 방문할 때 내려받는 양이 약 2MB로 늘었습니다. 느린 회선에서는 글꼴이 도착할 때까지 글자가 잠시 안 보일 수 있습니다. 글꼴 파일은 한번 저장소에 넣으면 이력에 용량이 영구히 남습니다.

발표자 표기는 "우제율", 발표일은 2026-07-30으로 갱신했습니다. 화면을 여는 순간부터 어둡게 칠해지도록 문서 머리에 선언을 넣어 흰 번쩍임을 막았습니다. 인쇄하면 흰 종이에 검은 글자와 검은 도형으로 되돌아가고, 별과 우주선은 종이에 찍히지 않습니다. 운영체제에서 "움직임 줄이기"를 켠 사용자에게는 모든 움직임이 정지합니다. 배포 직후에는 캐시 때문에 최대 10분간 예전 흰 화면이 섞여 보일 수 있습니다.

### 스크린샷 / 데모

로컬 미리보기: `python3 -m http.server 8123` 실행 후
- 첫 화면: http://localhost:8123/
- 발표 자료: http://localhost:8123/slides/cds-agentic-work/
- 견본: http://localhost:8123/slides/sample/ · 404: http://localhost:8123/404.html

(검증 스크린샷 7장 — 랜딩·랜딩 카드·모바일·덱 표지·그림 슬라이드 2장·단계 슬라이드·마무리·견본·404 — 은 세션 중 확인 후 폐기. 위 주소에서 동일 화면 재현 가능)

### 리뷰 포인트 (개발자용)

- `vendor/pretendard/pretendard.css:1` — 2.74MB base64 blob. **머지하면 git 이력에 영구 잔류** (되돌려도 clone 크기 유지). 출처·sha256·RFN 제약은 헤더 주석 참조.
- `slides/cds-agentic-work/index.html:28`, `slides/sample/index.html:30` — `html:root` 오버라이드. 테마 `<link>`와의 소스 순서 의존을 특이성으로 제거한 부분.
- `styles.css:344`, `404.html:56`, 덱 2개의 `@media print` — 인쇄 방어. 덱은 `html:not(.print-pdf)` 조건으로 `?view=print` 어두운 PDF 경로를 제외.
- `styles.css:104-160` — 별 좌표 재배치(구 `scale(0.6)` 좌상단 몰림 버그 제거). 102~104vh 좌표는 drift 상승분 보정용.
- `index.html:12-18` — CDN 제거·동봉 글꼴·`?v=2`·head 인라인 다크 선언. `?v=2`는 "새 HTML + 옛 CSS" 방향만 막음(반대 방향은 최대 10분 노출, 클래스명 동일해 무난히 렌더).
- `slides/cds-agentic-work/index.html:233` — `2026-07-30 · 우제율` (공개 문자열 변경 — 인터뷰에서 사용자 확정).
- CLAUDE.md 덱 규칙 3건 신설(Declare darkness / Pretendard vendor / decoration safety) — 다음 덱 작성자가 물려받는 규칙.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

2026-07-30 발표(기존 cds-agentic-work 덱 재사용)를 앞두고 사이트 전체를 "흰 우주선이 검은 우주를 유영"하는 테마로 반전. euiyun.com에서 값만 차용(자간 −0.025em, cubic-bezier(0.16,1,0.3,1), 느린 미세 모션), 구조(CDN 폰트, 입자 캔버스, 다색 악센트)는 배제. 한글 타이포그래피를 1급 관심사로: Pretendard Variable 동봉, 본문 500/제목 600, keep-all.

### 제약 (Constraints)

- 무채색 원칙(강조색 0개) — black.css의 파란 `--r-link-color` 계열을 반드시 덮을 것
- 덱은 file://로 열려야 함 — 글꼴은 base64 내장만 안전(Firefox 상위 디렉터리 차단, D1/D3)
- vendor/reveal.js 6.0.1 무수정 핀 — 죽은 570KB(Source Sans) 수용
- Pretendard는 무가공 복사만 허용(OFL RFN — 서브셋 시 개명 의무)
- 팔레트 고정: bg #0e0e0e / text #dedede(14.3:1) / bright #fcfcfb / dim #9aa0a6(7.3:1) / hairline #2a2b2a(1.35:1 의도적)
- 모션 상한: 우주선 주기 6s+ 이동 8px 이하, 별 140s+, 등장 0.7~1.2s, 키프레임 0%=100%(reduce 스냅 방지), SMIL 금지
- docs/blindspot 과거 문서 소급 수정 금지, 미래 덱의 테마 자유 원칙 유지

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| JS 실행 전/실패 시 흰 화면 | 4개 문서 head에 meta color-scheme + 인라인 html 배경 선언 (실패 시 실제 결과는 어두운 빈 화면 — reveal.css가 section을 숨김) |
| 별을 .slides 안에 넣으면 scale(1.48)로 좌표 붕괴 | .reveal 형제 fixed 층(.deck-stars)으로 분리 |
| reduce 모드에서 0.01ms 재생이 끝 상태에 고정 | 키프레임 시작=끝 설계 + animation:none 명시 이중 방어 |
| 보통 인쇄에서 div/span 도형이 흰 선으로 소실 | html:not(.print-pdf) 조건부 검정 복원 (?view=print 어두운 PDF는 의도적 수용) |
| 랜딩 인쇄 시 카드가 등장 전 opacity 0으로 인쇄 | @media print에서 opacity:1 강제 |
| sample 복사 시 link/style 순서 뒤집힘 | html:root(0,1,1)로 순서 무관하게 승리 |
| 배포 직후 HTML/CSS 캐시 불일치 | styles.css?v=2 (한 방향만 방어 — 반대 방향은 무해함 확인) |
| 404가 임의 깊이에서 뜸 | 자기완결 유지, 동봉 글꼴 미적용(시스템 폴백) |
| keep-all로 인한 넘침 | 20장 전수 스캔 0건 (overflow-wrap: anywhere 동반) |
| 우주선의 absolute 배치 시 가로 스크롤 | fixed 배치 (모바일 390px 가로 스크롤 없음 실측) |

### 검증 결과

check-runner 8항목 중 7 통과: JSON 유효, dir 매칭, 4문서 meta 통일(color-scheme/theme-color/파비콘 md5 동일), 외부 리소스 0건, 글꼴 동봉 무결(2,744,520B + LICENSE), 옛 이징 0건, 작업 트리 클린. "실패" 1건은 docs/blindspot 문서 2곳의 "우재율" 인용 — 결정 이력 보존을 위해 의도적 유지(구현 노트 15:41).

직접 실측: file://에서 Pretendard 로딩 true(Chromium)·20장 정상, reduce 에뮬레이션에서 장식 animation:none, print 에뮬레이션에서 도형 #000·장식 숨김·카드 opacity 1, 콘솔 오류 0, 모바일 가로 스크롤 없음. Firefox file:// 미실측(base64라 글꼴 fetch 자체가 없어 차단 메커니즘 무관). 미실행: ?view=print 실제 PDF 생성, 저속 회선 FOIT 체감, 프로젝터 리허설(발표자 몫).

### 의도적 범위 제외

- 라이트 테마 병행 / euiyun 입자 캔버스·다색 악센트 / 라틴 전용 폰트 / og:image
- docs/blindspot·퀴즈 HTML 테마 적용, 과거 문서 소급 수정
- 4K·모바일 별 밀도 최적화, main.js 기능 변경(빈 목록 카운트 등)
- black.css 내 미사용 570KB 정리(벤더 핀), 새 발표 자료 제작
- 전송량 최적화(서브셋) — RFN 제약으로 불가가 아니라 금지. 2MB는 오프라인 보장의 수용된 대가

### 구현 노트 요약

- 이탈 1건: 랜딩·404 인쇄 방어는 설계에 없었으나 보고 단계 분석이 회귀로 지적해 추가(15:40)
- 보수적 선택 2건: 덱 별 개수 34개(랜딩 80개보다 축소 — 집중 우선), blindspot 문서의 "우재율" 인용 유지(이력 보존)
- 사용자 확인 필요: 없음 (발표자 표기·날짜는 인터뷰에서 이미 확정. 프로젝터 리허설만 발표 전 권고)
