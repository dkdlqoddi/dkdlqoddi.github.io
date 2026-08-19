# Unknowns: Code Copy Button

## 1. Domain Unknowns (도메인 미지 영역)
- **reveal.js 환경의 동적 렌더링**: reveal.js는 초기화 시점에 슬라이드의 구조를 조작하거나 이벤트를 가로챌 수 있습니다. 코드 복사 버튼을 삽입하는 DOM 조작 스크립트가 `Reveal.initialize()` 이후에 실행되어야 하는가, 아니면 단순 DOMContentLoaded 시점에 실행되어도 `<pre><code>` 블록 탐색 및 버튼 삽입이 정상적으로 유지되는가?
  - *해소 방안*: 스크립트를 body 최하단에 배치하여 DOM 구성이 끝난 뒤 버튼을 삽입하고, 이벤트 위임(Event Delegation)을 사용하거나 직접 버튼에 click 리스너를 달아 동적 변화에 대비함.

## 2. Platform/Environment Unknowns (환경 미지 영역)
- **인쇄(PDF) 모드 호환성**: `@media print` 시에 복사 버튼이 인쇄물에 나타나면 지저분해집니다.
  - *해소 방안*: CSS에서 `@media print { .copy-code-btn { display: none !important; } }`를 적용하여 인쇄 화면에서 제외함.
- **클립보드 API**: 구형 브라우저 또는 로컬 환경(`file://` 프로토콜)에서 `navigator.clipboard.writeText`가 보안 정책(Secure Context)에 의해 동작하지 않을 수 있는가?
  - *해소 방안*: 가급적 `navigator.clipboard`를 사용하되, 실패 시 전통적인 `document.execCommand('copy')`로 폴백(fallback)하는 방어 로직을 구현함.

## 3. Implementation Unknowns (구현 미지 영역)
- **CSS 위상 및 여백**: `<pre>` 블록은 `reveal.js` 테마 CSS에 의해 기본 여백과 `position`이 부여되어 있을 수 있습니다. 복사 버튼을 우측 상단에 절대 위치(`position: absolute`)시키려면 부모 컨테이너(보통 `<pre>`)가 `position: relative`여야 합니다. 
  - *해소 방안*: 스크립트에서 탐색된 `<pre>` 태그에 동적으로 `position: relative` 속성을 부여하여 버튼의 앵커를 확보함.
