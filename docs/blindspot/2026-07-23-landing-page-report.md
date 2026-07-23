# 발표자료 랜딩 페이지 작업 보고서

- 날짜: 2026-07-23
- 기준: main (af6e3de) → feature/landing-page (90c73d4, 커밋 2개)
- 퀴즈: docs/blindspot/quiz/2026-07-23-landing-page.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

발표자료들을 안내하는 첫 화면(랜딩 페이지)이 만들어졌습니다. 흰 바탕에 검은 점 입자와 얇은 계기판 장식이 있는 우주 느낌 화면입니다. 카드를 누르면 해당 발표자료로 이동하며, 예시 발표자료 1개가 새 발표 추가 방법을 화면으로 안내합니다. 발표 도구(reveal.js)를 저장소 안에 동봉해, 개별 발표자료는 인터넷 없는 발표장에서도 열립니다. 아직 인터넷에는 공개되지 않았습니다. 퀴즈 통과 후 머지하고 push해야 공개됩니다.

### 스크린샷 / 데모

로컬 확인 방법: 저장소 폴더에서 `python3 -m http.server 8000` 실행 후 브라우저로 http://localhost:8000 접속.

확인 포인트: ① 첫 화면의 프레임·별 입자·대형 제목 등장 애니메이션, ② 카드(LOG 001) 클릭 시 예시 발표자료로 이동, ③ 방향키로 슬라이드 6장 넘김, ④ 없는 주소 입력 시 404 안내.
(검증 당시 스크린샷은 커밋에 포함하지 않았습니다 — `.playwright-mcp/`는 gitignore 대상)

### 리뷰 포인트 (개발자용)

- `main.js:75-99` — slides.json 항목 검증(필수: title, date=YYYY-MM-DD, dir)과 건너뛰기, 동일 날짜 안정 정렬, LOG 번호(시간순) 부여. 이 파일이 목록 렌더링의 전부.
- `main.js:68` — `fetch("slides.json", {cache:"no-cache"})`: GitHub Pages의 max-age=600 캐시를 재검증으로 완화.
- `index.html:16-17` — Pretendard v1.3.9 CDN 버전 고정. 랜딩의 유일한 외부 의존(데크는 외부 의존 0).
- `styles.css:40-45, 232-241` — @view-transition(장식)과 prefers-reduced-motion 전부 정지 정책(별·전환 별도 게이팅 포함).
- `slides/sample/index.html:11-17` — vendor 상대 경로(`../../vendor/`)가 오프라인(file://) 동작의 핵심. 절대 경로로 바꾸면 오프라인이 깨짐.
- `.nojekyll` — 삭제 금지(Jekyll의 Liquid 해석이 reveal.js 자산을 깨뜨림).
- `404.html:53` — `href="/"`는 배포·로컬 서버에서 정상, file:// 열람에서만 무효(허용된 한계).

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

slides.json 단일 매니페스트가 구동하는 정적 발표 허브. 랜딩은 데크 내부에 관여하지 않고 URL로만 연결(데크별 테마·전환 완전 독립). 데크는 vendored reveal.js 6.0.1 공유 사본으로 오프라인 자기완결. 랜딩 미학은 "흰 우주" 반전(흰 바탕 + 검은 미세 별 + HUD 헤어라인 프레임 + 모노스페이스 계기 문구), 완전 모노크롬.

### 제약 (Constraints)

- main push = 즉시 실배포 (GitHub Pages user site). 머지·push는 퀴즈 통과 후에만.
- `.nojekyll` 필수 유지. `.gitmodules`의 서브모듈은 공개 저장소 + HTTPS URL 유지(위반 시 배포 전체 실패).
- slides.json 스키마: `{title, date: "YYYY-MM-DD", description, dir}`. dir은 영문 소문자·하이픈(공개 URL 계약).
- vendor는 6.0.1 고정, 동봉 테마는 white/black(폰트 base64 내장형)만. 업그레이드는 vendor/ 통째 교체 + 전 데크 확인.
- 데크의 vendor 참조는 반드시 상대 경로(오프라인 file:// 보장). 랜딩은 온라인 전용(fetch 필요)이 의도된 한계.
- prefers-reduced-motion에서 모든 모션 정지(별 drift, 등장, View Transitions 각각 게이팅됨).
- 흰 바탕 모노크롬이 랜딩 정체성 — 다크 모드·악센트 색 도입은 범위 외 결정 사항.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| slides.json 항목의 필수 필드 누락/오타 | 해당 항목만 console.warn 후 건너뜀, 나머지 정상 렌더(브라우저 실검증: 4항목 중 2건 스킵) |
| slides.json 자체가 배열이 아님 | "목록 파일 형식이 올바르지 않습니다" 표시 |
| fetch 실패(HTTP 오류/네트워크) | "목록을 불러오지 못했습니다. 새로고침해 주세요" 표시 |
| 목록이 비어 있음(또는 전항목 무효) | "아직 기록된 발표가 없습니다" 표시 |
| 같은 날짜 발표 2개 이상 | 비교자 0 반환으로 안정 정렬(입력 순서 보존) |
| 자바스크립트 꺼짐 | noscript 안내(주소 직접 입력 경로 제시) |
| IntersectionObserver 미지원/reduced-motion | 카드 즉시 표시(등장 효과 생략) |
| 존재하지 않는 주소 | 404.html이 첫 화면 링크 제시. 폴더 대소문자 구분 경고 포함 |
| 데크를 file://로 직접 열기 | 비모듈 script + 상대 경로라 동작(연구 근거, Playwright는 file: 차단으로 미실측) |
| 랜딩을 file://로 열기 | fetch 실패 → 오류 문구(의도된 온라인 전용) |

### 검증 결과

- check-runner 6/6 통과: JSON 유효성, dir↔폴더 대응, HTML 로컬 참조 존재, vendor 필수 파일, .nojekyll 존재, slug 규칙.
- Playwright 실검증: 1440px/390px 렌더링, 카드 생성(번호·날짜·설명), 카드 클릭 → /slides/sample/ 이동, reveal 슬라이드 6장 + 해시(#/1), 404 렌더, 콘솔 오류 0.
- 가드 실검증: 깨진 항목 2개 혼입 시 정상 2개만 렌더 + 경고 2건 + "02 ENTRIES".
- 자동화 테스트/CI 없음(프로젝트에 테스트 체계 부재) — 회귀 방어는 check-runner 절차와 README 규칙에 의존.

### 의도적 범위 제외

검색·태그·페이지네이션(데크 10개 시 재검토), 다크 모드(흰 정체성), 대용량 영상 호스팅(100MiB 제한 — 외부 호스팅), 방문 통계, 목록 자동 생성 Actions, 데크 공통 스타일 강제, scroll-driven 고급 연출(Firefox 대기), SEO 심화.

### 구현 노트 요약

- 브랜치 전략: main 직접 작업 회피(`feature/landing-page`), push=배포 사고 방지.
- 시각 세부: HUD 프레임+반전 별 시그니처, 모노크롬 무악센트, 시스템 모노스페이스, LOG 번호=시간순, Pretendard v1.3.9 고정.
- 404는 독립형(외부 CSS 무참조), 데크는 상대 경로, View Transitions는 양쪽 문서 opt-in.
- 분석 지적 3건 반영: 항목 검증 가드, 안정 정렬, 데크 핀치 줌 차단 제거(WCAG 1.4.4).
- 사용자 확인 필요 항목: 없음 (전 노트 "아니오").
