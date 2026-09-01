# '나만의 돌쇠 AI 만들기' 노스크롤 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 최적화된 레이아웃 규칙
- **공통 슬라이드 여백**:
  - `h2`: `margin: 0 0 16px; font-size: 1.8em; line-height: 1.15;`
  - `h3`: `margin: 0 0 10px; font-size: 1.35em; line-height: 1.15;`
  - `p.eyebrow`: `margin: 0 0 6px; font-size: 0.52em;`
  - `p.small`: `margin: 0 0 12px; font-size: 0.56em; line-height: 1.35;`
- **2열 레이아웃 (`.cols-2`)**:
  - `grid-template-columns: 1.08fr 0.92fr; gap: 16px; align-items: start; margin-top: 4px;`
- **코드 블록 (`pre code`)**:
  - `pre`: `margin: 0; font-size: 0.52em;`
  - `code`: `padding: 0.6em 0.8em; line-height: 1.25; max-height: 380px;`
- **카드 패널 (`.panel-card`)**:
  - `padding: 8px 12px; margin-bottom: 6px; border-radius: 6px;`
  - `h4`: `margin: 0 0 3px; font-size: 0.66em;`
  - `p`: `margin: 0; font-size: 0.50em; line-height: 1.35;`
- **슬라이드별 컴팩트 디자인**:
  - **Slide 2 (비유 체계)**: 2개 열(좌 4개, 우 3개)의 컴팩트 패널로 배치.
  - **Slide 3~6, 8, 10~13, 17~19**: 2열 좌측 코드/트리, 우측 카드(2~3개) + 미니 SVG가 총 360~380px 이내로 배치되어 타이틀과 합쳐도 520px 이내.
  - **Slide 7 (Harness)**: 2x2 그리드 카드 (각 50px 높이) + 코드 1줄.
  - **Slide 9 (Flow & Loop)**: 좌측 Flow 다이어그램 패널 + 우측 Loop 스크립트 패널 나란히 배치.
  - **Slide 14 (Graph 전체 지도)**: SVG 높이 260px로 컴팩트화.
  - **Slide 15 (Local Checklist)**: 5단계 수평/2단 카드 그리드.
  - **Slide 16 (방법론 지도)**: 2열(좌 4개, 우 3개) 패널 그리드.
  - **Slide 20 (Beyond the Graph)**: 5개 항목 2단 그리드 + 출처/복귀 링크.
