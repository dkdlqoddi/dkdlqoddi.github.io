# Unknowns: EVA VIEW Overflow Prevention

## 1. Environment Unknowns
- **Reveal.js 뷰포트 제약**: `reveal.js`는 기본 해상도(960x700)에 맞게 컨텐츠를 자동으로 스케일링합니다. 하지만 개별 슬라이드의 내용이 너무 길어지면 브라우저 상하로 짤리거나 화면 밖으로 넘치게 됩니다.
  - *해결 방안*: `.reveal .slides section` 요소에 `max-height: 700px`과 `overflow-y: auto` 속성을 강제 주입하여, 내용이 초과할 경우 전체 뷰포트 밖으로 삐져나가는 대신 슬라이드 내부에서 스크롤되도록 방어막을 칩니다.
  - *추가 방어*: 가장 공간을 많이 차지하는 `<pre>` 코드 블록 역시 `max-height: 400px; overflow-y: auto;`로 제한하여 SVG 다이어그램 등 상단 컨텐츠를 밀어내지 않게 만듭니다.

## 2. Implementation Unknowns
- **기존 CSS와의 충돌 여부**: 각 덱마다 개별적인 `<style>` 블록을 가지고 있습니다. 
  - *해결 방안*: 모든 덱의 `index.html` 파일에 동일한 공통 CSS 방어 룰(EVA VIEW Overflow Prevention)을 최상위 특이성(`!important`)으로 삽입하여 확실하게 뷰포트 오버플로우를 차단합니다.
