# dkdlqoddi.github.io — 발표 기록

AI와 자동화에 관한 발표·실습 자료를 모은 GitHub Pages 사이트입니다.
`main`에 push하면 https://dkdlqoddi.github.io 에 배포됩니다.

## 공통 Template

전체 발표자료·sample·메인 목록은 **짙은 녹색 칠판, 밝은 분필 선, 읽기 좋은 Pretendard 고딕체**를 공유합니다. 제목·강조·본문에 같은 고딕체를 사용하고, 표지의 큰 Jelly Woo도 유지합니다. 발표에서는 순서대로 쓰는 판서를 다시 재생·일시정지하거나 완성 상태로 볼 수 있습니다. 읽기·동작 축소·인쇄에서는 완성된 판서를 표시합니다. 이력서와 기존 영상은 별도 테마를 유지합니다.

- `assets/theme.css`: 기본 토큰, Pretendard 글꼴, 버튼, 상단바, 동작 축소와 페이지 전환.
- `assets/chalk-theme.css`, `assets/chalk-motion.js`: 마지막에 연결하는 칠판 테마·순차 판서·재생 조작. 기존 로컬 Pretendard와 SVG 질감을 사용합니다. `[data-chalk-group]`은 카드·표·도식의 내부 요소를 순서대로 표시하고, `[data-chalk]`는 개별 판서, `[data-chalk="fade"]`는 아이콘·캐릭터 등 형태를 보존하는 등장을 지정합니다. 모든 모션은 공통 조작에 연결되며 fragment와 auto-animate 도식은 기존 동작을 유지합니다.
- `assets/template.js`: 메인·발표·404에서 사용하는 상단바. 스크립트 위치로 홈 주소를 계산하므로 중첩 URL과 `file://`에서도 사용할 수 있습니다.
- `slides/shared/deck-base.css`: 발표 화면, 읽기 화면, 목차, 이동 버튼, 카드·도식 컴포넌트, 인쇄 스타일.
- `slides/shared/cartoon-deck.css`: 기존 컴포넌트 윤곽의 기반. 칠판 CSS가 팔레트·선·그림자를 덮어씁니다. 독립 실습 HTML에는 내려받아도 읽을 수 있는 칠판 팔레트를 인라인으로 둡니다.
- `slides/shared/deck-template.js`: 공통 발표 셸, Reveal 초기화, 목차·키보드·프래그먼트 이동, 읽기/발표 전환, 메모, 전체화면, 인쇄.
- `slides/shared/lesson-layout.css`: 10모듈에서 재사용하는 단계별 도식·카드·표·코드 배치. 공개 과정은 1280×720이며 `legacy-deck.css`는 작성용 sample의 960×700 배치를 지원합니다.
- `slides/agent-tools-antigravity/course.js`: 해당 수업의 퀴즈·복사·실습 버튼만 담당합니다.

좁은 화면은 읽기 모드로 표시하고, 넓은 도표는 도표 영역에서 가로로 스크롤할 수 있습니다. 인쇄는 덱 전체를 한 장당 한 쪽으로 출력하고 발표 화면으로 복귀합니다. 메인 장식과 카드도 같은 칠판 팔레트를 사용하며, 반복 회전 대신 제목·카드 내용·아이콘·장식이 순서대로 나타납니다. 판서 조작은 백그라운드 정지와 시스템 동작 축소를 지원합니다.

## 두 학습 과정

공개 자료는 **10모듈, 122장**입니다. 비전문가 과정은 52장, 전문가 과정은 선택 모듈을 모두 합쳐 70장입니다. 메인에서 과정을 먼저 선택합니다. `slides.json`의 과정별 순서를 사용하며 날짜로 다시 정렬하지 않습니다.

- **비전문가:** N1 기초 → N2 내 자료 → N3 첫 파일 → N4 결과 검토. 기술 구현 설명은 줄이고 같은 사례의 입력·실행·결과·확인을 도식으로 따라갑니다.
- **전문가:** E0 공통 기초 → E1 자동화에 넣는 위치 → E2 검증과 실행 경계 → **E3 SW 또는 E4 EDA 선택**. E5는 보안·인프라 담당자를 위한 운영 심화입니다. SW와 EDA를 모두 수강할 필요는 없습니다.

| 모듈 | 발표 | 장수 | 경로 |
|---|---|---:|---|
| N1 | [LLM과 Agent 이해하기](slides/llm-agent-basics/) | 14 | 입문 필수 |
| N2 | [내 자료로 답 만들기](slides/notebooklm-examples/) | 12 | 입문 필수 |
| N3 | [Agent로 첫 파일 완성하기](slides/agent-tools-antigravity/) | 14 | 입문 필수 |
| N4 | [결과를 검토하고 사용하기](slides/ai-work-review/) | 12 | 입문 필수 |
| E0 | [모델·Agent·실행 환경의 경계](slides/agent-engineering-basics/) | 10 | 전문 공통 |
| E1 | [자동화에 AI를 넣는 위치](slides/design-ax-transition/) | 12 | 전문 공통 |
| E2 | [검증과 실행 경계 설계](slides/ai-agent-skills-philosophy/) | 10 | 전문 공통 |
| E3 | [SW: 모델 호출에서 Agent 연동까지](slides/dx-vs-ax-automation/) | 12 | SW 선택 |
| E4 | [EDA: 근거를 남기는 설계 업무 Agent](slides/my-dolsoe-ai/) | 14 | EDA 선택 |
| E5 | [보안·인프라: 실행 환경과 운영 설계](slides/integrated-architecture/) | 12 | 운영 선택 심화 |

기존 URL 9개를 유지하고 E0만 추가했습니다. 이전 장 ID와 숫자 링크는 같은 발표의 관련된 새 장으로 이어집니다. 새 공유 링크는 의미가 있는 장 ID를 사용하세요. 각 장의 발표자 메모에 설명·활동·주의할 해석을 남겼고 마지막 장에서 다음 모듈과 과정 목록으로 이동합니다.

N1은 같은 매출 예시로 웹 질문·Agent 질문·파일 생성 명령을 비교합니다. N2는 여행 자료 한 세트로 질문부터 근거 확인까지 진행하고, 다른 주제는 [선택 실습](slides/notebooklm-examples/practice.html)으로 제공합니다. N3와 N4는 같은 **산들 독서모임** 자료를 제작과 검토에 이어 사용합니다. [N3 준비 안내](slides/agent-tools-antigravity/preparation.html), [N4 활동지](slides/ai-work-review/practice.txt)를 함께 사용하세요.

E3·E4는 [SW 실습](slides/shared/labs/sw.html)과 [EDA 실습](slides/shared/labs/eda.html), [실습 ZIP](slides/shared/labs/course-labs.zip)을 제공합니다. Python 3.10 이상과 표준 라이브러리로 로컬 HTTP·도구 호출·근거 검증·종료 조건을 재현합니다. 기본 모델은 고정 응답의 모의 모델입니다. 실제 OpenCode 연결은 별도 선택 실습이며 모델 설정·권한·비용을 확인해야 합니다. 가상 EDA 자료는 상용 툴 실행이나 sign-off를 대신하지 않습니다.

제품·API 근거는 2026-10-12 공식 문서 확인 기준이며 각 발표에서 링크합니다. 사례 수치·모의 데이터·미검증 범위를 구분하고 성능이나 안전을 무조건 보장하지 않습니다. 모든 모듈에 PDF가 있습니다. `sample`은 작성용 8장 견본이며 공개 과정 수에 포함하지 않습니다.

## 새 발표자료 추가

1. `slides/sample/`을 새 폴더로 복사합니다. 폴더 이름은 영문 소문자·하이픈을 사용합니다. 이 이름이 공개 URL입니다. `sample`은 복사용 원본이므로 목록에 등록하지 않습니다.
2. `index.html`의 제목과 `<section>` 내용을 수정합니다. 공통 CSS와 JS 연결을 유지하고 덱 고유 스타일만 추가합니다. 별도의 `Reveal.initialize()` 호출은 필요 없습니다. `<section id="intro" data-title="소개" data-chapter="시작">`처럼 지정하면 목차와 공유 주소에 사용합니다. 생략하면 순서와 제목에서 자동 생성합니다.
3. 루트 `slides.json`의 해당 과정 위치에 등록합니다. `track`은 `novice` 또는 `expert`, `path`는 `core`, `common`, `sw`, `eda`, `operations` 중 목적에 맞게 선택합니다. `prerequisites`는 선수지식을 설명하는 문장, `next`는 다음 덱의 폴더 이름 배열입니다. 마지막 장의 링크도 같은 경로로 연결합니다.
   ```json
   {
     "title": "발표 제목", "date": "2026-10-12", "updated": "2026-10-12",
     "description": "완료할 과제", "dir": "my-talk",
     "stage": "업무 적용", "audience": "AI 활용 입문자",
     "track": "novice", "module": "N5", "path": "core",
     "prerequisites": "N4 · 검토 실습 경험", "next": [],
     "pdf": "my-talk.pdf", "slideCount": 8
   }
   ```
4. `python3 scripts/build_course_catalog.py`로 메인의 정적 목록을 생성하고 이 문서의 과정 표와 메인의 과정 소개를 갱신합니다. JavaScript가 꺼지거나 목록 요청이 실패해도 같은 두 과정을 볼 수 있습니다.
5. 아래 검증과 `export_pdfs.cjs`로 PDF를 갱신한 뒤 PR 리뷰를 거쳐 반영합니다. 오래된 장을 통합할 때는 `data-previous-ids`와 `body[data-previous-order]`를 새 ID에 매핑합니다. 기존 공유 주소의 의미를 유지하세요.

CSS 순서는 Reveal의 `white.css` → `assets/theme.css` → `deck-base.css` → 필요한 경우 `legacy-deck.css` → 덱 고유 스타일 → `cartoon-deck.css` → `jelly-woo.css` → `assets/chalk-theme.css` → 단계별 도식이 있는 덱의 `lesson-layout.css`입니다. JS 순서는 Reveal → `assets/template.js` → `deck-template.js` → 덱별 실습 코드 → `assets/chalk-motion.js`입니다. 칠판 페이지는 `<html class="cartoon-theme chalk-theme">`와 `color-scheme: dark` 메타를 사용합니다.

모든 슬라이드는 내용에 맞는 jelly-woo 포즈와 배치를 사용합니다. [공용 이미지 디렉터리](assets/images/jelly-woo/README.md)에 15종 WebP(512px·고해상도 1024px), 생성 원본 PNG, 캐릭터 기준 시트와 프롬프트가 있습니다. 첫 장은 큰 캐릭터의 `cover` 배치가 필수입니다. 새 장마다 `data-jelly-woo`와 `data-jelly-layout`을 함께 선택합니다. `cover`·`feature`·`guide`는 캐릭터를 왼쪽에 두고 본문을 `.jelly-main`으로 감싸 오른쪽에 배치합니다. 도표 중심의 `banner`·`corner`는 캐릭터를 오른쪽 위에 고정하고 넓은 본문을 유지합니다. 읽기·모바일은 단일 열에서도 같은 좌우 정렬을 유지합니다. `sample`에 예시가 포함되어 있습니다. 배포 PDF는 로컬 서버 실행 후 `NODE_PATH=/tmp/presentation-check/node_modules node scripts/export_pdfs.cjs`로 갱신합니다. 특정 자료만 만들려면 명령 뒤에 덱 폴더 이름을 붙입니다(예: `node scripts/export_pdfs.cjs llm-agent-basics`).

## 로컬 미리보기와 검증

```bash
python3 -m http.server 8000
# http://localhost:8000
```

덱 하나는 `slides/<폴더>/index.html`을 직접 열어도 됩니다. 메인 목록은 HTTP 서버에서 확인합니다. 발표의 `?view=read`는 읽기 화면, `?view=slides`는 발표 화면, `?view=print` 또는 `?print-pdf`는 인쇄 화면입니다. 이전의 `#/2` 같은 슬라이드 주소도 지원합니다.

```bash
python3 scripts/verify_deck.py
python3 scripts/verify_course_labs.py
```

실제 브라우저 검증에는 Playwright와 Chrome이 필요합니다. 사이트에는 빌드나 npm 의존성을 추가하지 않습니다. 위 HTTP 서버를 실행한 상태에서:

```bash
npm install --prefix /tmp/presentation-check playwright
NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_theme.cjs
NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_chalk.cjs
NODE_PATH=/tmp/presentation-check/node_modules node scripts/verify_curriculum.cjs
```

필요하면 `CHROME_PATH`, `SITE_URL`, `ARTIFACT_DIR` 환경변수를 지정합니다. 검증은 전체 덱의 배경 밝기·본문 대비, 탐색·목차·읽기 화면·모바일·오프라인·PDF, 프래그먼트, 최신 덱 실습, 판서 재생·정지·완성·동작 축소·인쇄 최종 상태, 두 과정과 JavaScript 비활성 목록의 학습 순서·선수지식·이전 공유 링크, 목록 오류와 404를 확인합니다. 스크린샷과 PDF는 기본 `/tmp/presentation-theme-check/`에 저장합니다.

## 영상 만들기

‘AI, 한 걸음 더’ 영상은 **2026-09-20의 기존 22장 구성**을 보존한 자료입니다. 현행 N3는 14장이며 영상의 내용·디자인과 구분합니다. 기존 영상은 자막·배경음·효과음이 있는 1080p 60fps로 만들 수 있습니다. 영상 장면은 `video/agent-tools-antigravity/`에 있고 자막 원고는 같은 폴더의 `script.js`입니다. 브라우저로 이 폴더의 `index.html`을 열면 미리보기(스페이스 재생, ←/→ 5초 이동, `[`/`]` 장면 이동)가 됩니다. 외부 API 없이 로컬 Chrome·ffmpeg·Python(numpy, scipy)만 사용합니다. 위 HTTP 서버를 실행한 상태에서:

```bash
NODE_PATH=/tmp/presentation-check/node_modules node scripts/render_video.cjs
```

결과는 git이 무시하는 `video/out/`의 `ai-tools-intro.mp4`, `.srt` 자막, `.png` 표지 이미지입니다. 영상은 저장소에 커밋하지 말고 외부에 올리세요. `VIDEO_RANGE=0-20`으로 일부 구간만, `VIDEO_WORKERS`로 병렬 수를 정할 수 있습니다. 영상 장면은 `source-slides.json`의 제작 당시 순서와 대조합니다. 현행 발표 편집이 영상 재제작을 강제하지 않습니다. 영상 자체를 개편할 때는 스냅샷·`script.js`·`scenes.js`를 함께 검토합니다.

## 파일과 자산

`vendor/reveal.js/`는 Reveal 6.0.1, `vendor/pretendard/`는 제목과 본문에 쓰는 Pretendard 글꼴과 라이선스를 동봉합니다. `vendor/three.js/`와 `vendor/montserrat/`는 과거 자료용 자산으로 보관하며 현재 공통 템플릿에서는 불러오지 않습니다. 라이브러리나 글꼴을 CDN에서 불러오지 마세요.

404는 임의 깊이 URL에서도 공통 테마를 읽도록 루트 경로를 사용하며 자산을 읽지 못해도 기본 안내가 표시됩니다. `practice-result.html`은 공통 테마를 연결하되 단일 파일로 내려받아도 인라인 스타일만으로 열립니다.

- `.nojekyll`을 삭제하면 Jekyll이 Reveal 파일의 `{{ }}`를 해석할 수 있으므로 유지합니다.
- 서브모듈은 공개 저장소와 HTTPS URL을 유지합니다.
- 동봉 글꼴 데이터와 라이선스는 수정하거나 서브셋하지 않습니다.
- Reveal 플러그인은 동봉되어 있지 않습니다. 순수 HTML을 사용하고, 진행 메모는 공통 셸의 `<aside class="notes">`를 사용합니다.
- 확대 금지 옵션을 추가하지 않습니다. 도표에는 `role="img"`와 설명을 제공하고 `currentColor` 또는 공통 색상 토큰을 사용합니다.
- 프래그먼트와 모핑의 견본은 `sample`의 마지막 보너스 두 장에 있습니다. 동작 축소와 인쇄에서도 확인하세요.
- 결정은 `docs/decisions.md`에 한 줄씩 추가합니다. 이 작업 흐름으로 다른 `docs/` 문서를 만들지 않습니다. 머지 게이트는 PR 리뷰입니다.
