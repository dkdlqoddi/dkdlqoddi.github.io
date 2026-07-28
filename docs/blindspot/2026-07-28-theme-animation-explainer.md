# 테마 및 애니메이션 개선 설계 (Explainer)

- 날짜: 2026-07-28
- 관련 문서: [요구사항](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-theme-animation-requirements.md), [Unknowns](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-theme-animation-unknowns.md)

## 개요
이 프로젝트는 기존의 엄격했던 무채색 테마를 벗어나, 오프라인 및 인쇄/접근성 제약을 깨지 않는 선에서 화려한 액센트 컬러(`--primary`, `--secondary`)와 시네마틱 애니메이션(View Transitions API)을 도입하여 랜딩 페이지와 발표 자료의 시각적 완성도를 극대화합니다.

## User Review Required
> [!WARNING]
> 기존 무채색 제한 규칙(`CLAUDE.md` 명시)을 의도적으로 완화하여 컬러를 도입하는 메이저 디자인 변경입니다. 이 변경은 향후 생성되는 모든 새 슬라이드 템플릿의 기준이 됩니다.

## 설계 결정 (Design Decisions)
1. **디자인 토큰**: `styles.css` 최상단에 `--primary`, `--secondary` 색상을 정의하고, 이를 버튼, 카드 테두리, 슬라이드 내 강조 요소에 제한적으로 적용합니다.
2. **시네마틱 애니메이션**: 랜딩 페이지(`index.html`)와 슬라이드 간 전환 시 기존의 단순 교체를 넘어 View Transitions의 크로스페이드 시간을 늘리고, 슬라이드 내부 Reveal.js는 `transition: 'fade'` 등 부드러운 효과로 변경하여 영화 같은 느낌을 줍니다.
3. **가드레일 방어**: 
   - `@media print` 에서는 컬러를 다시 검정/흰색으로 덮어써서 백지 인쇄를 보호합니다.
   - `@media (prefers-reduced-motion: reduce)` 에서는 모든 전환 효과를 `0.01ms !important`로 즉각 차단합니다.
   - 무거운 외부 JS/이미지 자산은 배제하고 순수 CSS로 입체감(Gradients, Shadows)을 구현합니다.

## Proposed Changes

### Global Theme & CSS
CSS 전역 변수 구조 개편 및 시네마틱 뷰 트랜지션 로직 적용.

#### [MODIFY] [CLAUDE.md](file:///c:/Workspace/dkdlqoddi.github.io/CLAUDE.md)
- "monochrome, no accent colors" 규칙을 예외 처리하고 제한적인 테마 색상(Primary/Secondary) 허용 규정을 추가.

#### [MODIFY] [styles.css](file:///c:/Workspace/dkdlqoddi.github.io/styles.css)
- 최상단 `:root`에 `--primary`, `--secondary` 등 액센트 컬러 추가.
- 카드 호버, 링크 등 특정 UI 요소에 그라데이션 및 새 액센트 컬러 적용.
- `@view-transition` 블록 내의 크로스페이드 애니메이션 시간을 약 0.4s로 늘려 시네마틱 효과 부여.
- `@media print` 및 `prefers-reduced-motion` 내부의 강제 정지/흑백 변환 규칙이 새 색상 변수에도 완벽히 적용되도록 `!important` 방어벽 유지.

### Landing Page
랜딩 페이지 내 카드 및 UI 요소 컬러 반영.

#### [MODIFY] [index.html](file:///c:/Workspace/dkdlqoddi.github.io/index.html)
- 랜딩 페이지의 카드 컨테이너(`<div class="card">`) 호버 시 `--primary` 색상 그라데이션 배경이 적용되도록 CSS 클래스 연결.
- 인라인 SVG 요소들의 `currentColor` 및 테두리 색상 등에 새로운 테마 변수 매핑 적용.

### Slide Template
Reveal.js 기본 템플릿의 전환 효과 변경.

#### [MODIFY] [slides/sample/index.html](file:///c:/Workspace/dkdlqoddi.github.io/slides/sample/index.html)
- `Reveal.initialize`의 `transition` 옵션을 `fade` 로 고정하여 시네마틱 효과 강화.
- `html:root`로 덮어쓰고 있던 무채색 강제 구문을 해제하고, `styles.css`에서 넘겨받은 `--primary` 등을 `--r-main-color`나 `--r-link-color`에 맵핑.

## Verification Plan

### Manual Verification
1. `python3 -m http.server 8000`으로 로컬 서버를 띄워 랜딩 페이지 -> 슬라이드 진입 시 시네마틱 전환 확인.
2. 브라우저 개발자 도구에서 렌더링(Rendering) 탭 -> `Emulate CSS prefers-reduced-motion: reduce` 설정 후 화면 컷 전환(0.01ms) 즉시 정지 확인.
3. 브라우저에서 `Ctrl+P` (인쇄 모드) 진입 시, 모든 액센트 컬러가 사라지고 깔끔한 흑백으로 렌더링되는지 확인.
