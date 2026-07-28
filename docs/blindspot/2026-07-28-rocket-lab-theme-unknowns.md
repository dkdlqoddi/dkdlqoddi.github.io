# Rocket Lab 테마 이관 및 렌더링 개선 Unknown Unknowns

- 날짜: 2026-07-28
- 입력: [요구사항 문서](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-rocket-lab-theme-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 가변 폰트 초경량화 (https://github.com/fonttools/fonttools) | Montserrat 폰트 최적화(서브세팅) 시 폰트 굵기(font-weight) 가짓수를 어떻게 할 것인가? | 용량 최소화를 위해 일반(400)과 굵은(700) 두께만 포함함 | 사용자 |
| 2 | 전역 스타일 통합 지점 (slides/sample/index.html:39-40, styles.css:18) | 폰트 교체 및 안티앨리어싱 CSS 범위를 랜딩 페이지까지 확대 적용할 것인가? | 일관성을 위해 랜딩 페이지를 포함한 프로젝트 전체에 일괄 적용함 | 사용자 |
| 3 | 모노크롬 규칙 위반 (slides/sample/index.html:30-46) | 기존 템플릿에 잔존하는 보라/청록 포인트 컬러를 어떻게 처리할 것인가? | 프로젝트 기본 규칙(모노크롬)에 따라 모든 색상을 무채색(#fcfcfb 등)으로 강제 전환 | 자체 해소 |
| 4 | 폰트 스택 벤더링 위치 (slides/sample/index.html:19-20) | 새 영문 폰트 파일을 저장소 내에서 어떻게 관리하고 로드할 것인가? | vendor 경로에 base64로 폰트를 내장한 montserrat.css 신설 및 기존 방식 유지 | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| - | 없음 | - | - |

## 스캔 원본 요약

### conventions
- 테마 변수에 보라/청록 등 강조 색상이 사용되어 모노크롬 규칙을 위반하는 상태임.
- 폰트 파일은 외부 통신 없이 vendor 디렉토리에 base64 형태로 내장하여 사용 중임.
- 다이아그램 등 인라인 SVG는 하드코딩된 색상 없이 currentColor 속성을 이용해 테마 색을 상속받음.
- 글자 및 요소 크기는 고정 px 대신 캔버스 비례 단위인 em을 사용하고 있음.

### similar-features
- 현 저장소 내 JS 기반의 마우스 인터랙션이나 애니메이션 로직은 일절 사용되지 않고 순수 CSS 정적 방어만 구성됨.

### integration-points
- slides 하위에 총 3개의 index.html 문서가 존재하여 일괄 마이그레이션 타겟이 됨.
- 랜딩 페이지 역할을 하는 styles.css에도 폰트 설정이 존재함.
- 신규 영문 폰트(Montserrat)를 CSS 맨 앞에 등록하여 폰트 스택의 영문 우선순위를 확보해야 함.
