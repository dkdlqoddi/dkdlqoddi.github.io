# Python Automation DX vs AX 미지 영역 (Unknown Unknowns)

- 날짜: 2026-08-19
- 입력: [requirements](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-08-19-dx-vs-ax-automation-requirements.md)
- 스캔 렌즈: conventions / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 모든 기존 덱이 동일한 CSS 변수 세트(팔레트, 폰트)를 사용함 (slides/sample/index.html:32–48) | 새 덱의 색상 팔레트를 어떻게 할지 | 기존 검은 우주 팔레트(배경 #0e0e0e, 글자 #dedede)를 그대로 사용 | 자체 해소 |
| 2 | 코드 블록의 글자 크기가 기본 0.55em이면 960×700 캔버스에서 23.1px로 하한(24px) 미달 (slides/sample/index.html:80) | Python 코드 블록의 글자 크기를 어떻게 설정할지 | 기존 관례대로 pre 글자 크기를 0.58em(≈24.4px)으로 설정 | 자체 해소 |
| 3 | SVG 다이어그램은 currentColor로만 색을 칠하면 인쇄 시 검정으로 자동 전환됨 (slides/sample/index.html:95–96) | Flow Chart SVG에 색을 직접 지정하면 인쇄에서 깨지는지 | Flow Chart의 강조색(DX/AX 구분)에 직접 색을 쓸 수 있지만, 인쇄 CSS에 색 되돌림 규칙을 추가해야 함 | 자체 해소 |
| 4 | 한글과 영문이 섞인 SVG text 요소에서 font-family를 지정하지 않으면 시스템 기본 폰트로 떨어짐 (slides/sample/index.html:98) | SVG 안의 한영 혼용 텍스트가 제대로 보이는지 | `.reveal .diag text { font-family: inherit; }` 규칙이 있으므로 SVG 텍스트가 덱 폰트를 상속받아 정상 출력됨 | 자체 해소 |
| 5 | fragment 애니메이션을 SVG 내부 요소에 적용하려면 transform-box 설정이 필요함 (slides/sample/index.html:100) | Flow Chart 조각 공개 애니메이션이 SVG 안에서 동작하는지 | `.reveal svg [data-id], .reveal svg .fragment { transform-box: fill-box; }` 규칙이 이미 있어 동작함 | 자체 해소 |
| 6 | opencode CLI의 headless 모드는 `opencode --headless` 플래그로 실행하여 터미널 UI 없이 프롬프트를 보내고 결과를 표준 출력으로 받음 | subprocess 코드 예시에서 어떤 명령어 형태를 보여줄지 | `subprocess.run(["opencode", "--headless", "-p", "프롬프트"], capture_output=True, text=True)` 패턴 사용 | 자체 해소 |
| 7 | Langchain의 ChatOpenAI 클래스는 base_url 매개변수로 사내 LLM 주소를 연결 가능 | Langchain 코드 예시에서 어떤 클래스와 매개변수를 보여줄지 | `ChatOpenAI(base_url="https://내부주소/v1", api_key="키")` 패턴 사용 | 자체 해소 |
| 8 | slides.json 등록 시 main.js가 title, dir, date(YYYY-MM-DD 형식) 필수 검증을 수행함 (main.js:37–43) | 새 덱 등록 절차에서 주의할 점 | date 형식을 YYYY-MM-DD로 정확히 맞추면 됨, description은 선택사항이지만 관례상 포함 | 자체 해소 |
| 9 | 기존 덱들이 모두 HUD 프레임과 galaxy 3D 배경을 포함함 (slides/design-ax-transition/index.html) | 새 덱에도 HUD와 은하 배경을 넣어야 하는지 | 기존 관례를 따라 포함 | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| — | (없음 — 모든 항목이 코드 근거 또는 도메인 지식으로 해소됨) | — | — |

## 스캔 원본 요약

### conventions

- 새 덱은 `slides/sample/index.html`을 복사하여 시작 (SKILL 규칙 및 slides/sample/ 내용 확인)
- CSS 변수: `--primary: #fcfcfb`, `--secondary: #9aa0a6`, `--r-background: #0e0e0e` 등 통일
- 폰트: Montserrat + Pretendard Variable, 상대 경로로 vendor에서 로드
- SVG 다이어그램: `svg.diag` 클래스, `currentColor` 기반, `.dim`/`.bright` 클래스로 위계 표현
- HUD 프레임: `.hud` 고정 테두리 + 네 모서리 라벨
- 제목 대문자 해제: `text-transform: none` 필수
- `@view-transition`, `@media (prefers-reduced-motion: reduce)`, 인쇄 방어 블록 필수

### integration-points

- vendor 자산 상대 경로: `../../vendor/reveal.js/dist/`, `../../vendor/montserrat/`, `../../vendor/pretendard/`, `../../vendor/three.js/`, `../../scripts/galaxy3d.js`
- slides.json: 배열에 `{title, date, description, dir}` 객체 추가, `dir`이 `slides/<dir>/index.html`과 일치해야 함
- 랜딩 페이지 변경 불필요: main.js가 slides.json을 동적으로 읽어 카드 생성

### edge-cases

- 코드 블록 글자 크기 하한: 0.58em 이상 유지 (테마 기본 0.55em은 미달)
- SVG 텍스트에 한글이 들어가면 word-break 영향 없음 (SVG는 HTML word-break 무시)
- 코드 블록이 길면 960px 캔버스에서 가로 스크롤 발생 — 코드를 짧게 유지하거나 font-size 조정 필요
- fragment fade-up을 SVG `<g>`에 적용 시 transform-box: fill-box 필수 (이미 전역 규칙으로 설정됨)

### domain

- DX(디지털 전환): 수작업을 Python 스크립트로 자동화, 규칙 기반(if/else), 결정론적, 고정된 분기 로직
- AX(AI 전환): LLM이 판단을 담당, 비정형 데이터 처리 가능, 맥락 이해 기반 분기, 자연어 입출력
- subprocess + opencode: Python에서 외부 CLI 도구를 호출하여 LLM에 질문, 결과를 stdout으로 수신
- Langchain + ChatOpenAI: Python 코드 안에서 직접 LLM API 호출, 체인·메모리·출력 파서 등 고급 기능 사용 가능
- 추가 방법: OpenAI SDK의 base_url 커스터마이징, 직접 HTTP 요청(requests 라이브러리)
