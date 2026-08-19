# Explainer: EVA VIEW Overflow Prevention

## 개요
이 문서는 `reveal.js` 발표 자료에서 슬라이드 내용(특히 SVG 다이어그램과 코드 블록)이 너무 길어져 기본 뷰포트(EVA VIEW: 960x700)를 벗어나는 문제를 해결하기 위한 조치 방안입니다.

## 문제 원인
- `reveal.js`는 슬라이드 크기를 960x700 캔버스에 맞춰 브라우저 크기에 비례하여 스케일링(`transform: scale()`)합니다.
- 그러나 개별 `<section>` 내부의 실제 컨텐츠(높이가 긴 SVG + `<pre>` 코드 블록 + 요약 텍스트)의 물리적 높이가 700px을 초과할 경우, 캔버스를 뚫고 나가거나 하단 텍스트가 짤리는 오버플로우 현상이 발생합니다.

## 해결 방법
모든 슬라이드 파일의 `<style>` 태그에 다음 CSS 제약 룰을 주입합니다.

1. **Section 높이 제한**: 
   - `.reveal .slides section { max-height: 700px !important; overflow-y: auto !important; overflow-x: hidden; }`
   - 슬라이드의 컨텐츠가 700px을 넘어가면 슬라이드 내부에서 자체 스크롤이 생기도록 하여 화면 밖으로 넘치지 않게 방어합니다.

2. **코드 블록 제한**:
   - `.reveal pre { max-height: 400px; overflow-y: auto; }`
   - 코드가 길어질 경우 코드 블록 안에서 스크롤을 유도하여, 위의 SVG나 텍스트 영역을 과도하게 침범하지 않도록 안전 마진을 둡니다.

위 방식을 통해 모든 발표 페이지들을 일괄 보호하여 안정적인 레이아웃을 보장합니다.
