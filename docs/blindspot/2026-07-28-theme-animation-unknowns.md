# 테마 및 애니메이션 개선 미지 영역 (Unknowns)

- 날짜: 2026-07-28
- 상태: 초안
- 관련 문서: [요구사항](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-theme-animation-requirements.md)

## 발견된 미지 영역 (Unknown Unknowns)

### 1. 색상 주입 레이어 및 범위 (Integration)
현재 무채색 전역 변수로 강제된 테마에 여러 액센트 컬러(Primary, Secondary)를 주입할 때, Reveal.js 내부 테마 변수와 배경 등을 얼마나 광범위하게 덮어쓸 것인가의 문제.
**결정**: 기존 제약을 풀고 Primary/Secondary 색상을 도입하되, 작업 범위를 무한정 확장하지 않고 랜딩 페이지의 카드 보더, 슬라이드 헤딩, 링크 등 특정 UI 요소와 CSS 그라데이션에만 색상을 제한적으로 적용한다.

### 2. 시네마틱 애니메이션 한계 및 호환성 (Domain & Edge-cases)
Reveal.js의 초기 렌더링 지연과 View Transitions API의 타임아웃 및 구형 브라우저 호환성 문제.
**결정**: View Transitions API의 기본 크로스페이드 속성과 Reveal.js의 내장 transition 속성만 사용하며 구형 브라우저에서의 뚝 끊기는 전환(딱딱한 화면 전환)을 허용한다.

### 3. 인쇄 및 애니메이션 방어 규칙 충돌 (Conventions & Edge-cases)
새롭고 화려한 배경 및 애니메이션이 종이 인쇄(Print-safe) 모드와 애니메이션 줄이기(Motion-safe) 모드에서 기존 규칙과 충돌하는 문제.
**결정**: 기존의 `!important` 방어선(종이 인쇄 시 흑백/흰색 강제 변환 및 애니메이션 0.01ms 즉각 정지)을 완벽하게 유지하며 새 코드도 이에 종속시킨다.

### 4. 시각 자원의 오프라인/용량 제약 (Domain & Edge-cases)
시네마틱 효과를 위해 비트맵 에셋을 추가할 경우 발생할 수 있는 오프라인 100MiB 저장소 용량 한계.
**결정**: 외부 이미지나 아이콘 에셋 추가 없이 CSS 그라데이션, 그림자, 인라인 SVG 코드 등 순수 코드로만 화려함을 구현한다.

## 확정된 기술적 대응 (결론)

1. **디자인 토큰**: `styles.css`에 `--primary`, `--secondary` 등 다양한 테마 색상 변수를 추가하여 랜딩 페이지와 슬라이드의 뷰 레이어를 대대적으로 개편한다.
2. **시네마틱 엔진**: MPA 기반 `@view-transition`과 Reveal.js 전환 효과를 조합하여 화려한 효과를 내되, 외부 JS 애니메이션 라이브러리(GSAP 등)의 사용 및 직접적인 DOM 조작 JS 작성을 전면 금지한다.
3. **가드레일 방어벽 보존**: 새로운 테마 관련 CSS 코드는 모두 `@media print` 흑백 반전 덮어쓰기와 `@media (prefers-reduced-motion: reduce)` 애니메이션 무효화(`0.01ms !important`) 블록 내에 철저하게 포섭되도록 구조화한다.
