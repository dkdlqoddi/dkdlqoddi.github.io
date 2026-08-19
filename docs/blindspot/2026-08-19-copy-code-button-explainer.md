# Explainer: Code Copy Button

## 개요
이 문서는 `dkdlqoddi.github.io` 내의 모든 `reveal.js` 발표 자료의 코드 블록(`<pre><code>`) 우측 상단에 "복사(Copy)" 버튼을 추가하는 기능의 설계 명세서입니다. 
외부 플러그인과 CDN 사용을 완전히 금지하는 저장소 제약 사항에 맞추어, 순수 Vanilla JS 및 CSS를 이용하여 공통 스크립트 기반으로 구현합니다.

## 대상 스코프
- 대상 파일: `slides/shared/code-copy.js` (신규 생성), `slides/shared/code-copy.css` (신규 생성)
- 반영 슬라이드: 총 5개의 덱 (`ai-agent-skills-philosophy`, `design-ax-transition`, `dx-vs-ax-automation`, `integrated-architecture`, `sample`) `index.html`

## 아키텍처 및 작동 흐름
1. **공통 에셋 로딩**: 각 `index.html` 파일 하단에서 `../../slides/shared/code-copy.css`와 `../../slides/shared/code-copy.js`를 로드합니다.
2. **동적 DOM 조작**:
   - `code-copy.js`는 로드 즉시 문서 내의 모든 `<pre>` 요소를 탐색합니다.
   - 각 `<pre>` 요소의 `position` 속성을 `relative`로 강제 설정하여 자식 요소인 버튼의 앵커로 삼습니다.
   - `<button class="copy-code-btn">Copy</button>` DOM을 생성하여 `<pre>` 내부 최상단에 삽입합니다.
3. **상호작용 및 시각 효과 (Hover 기반)**:
   - `code-copy.css`는 `.copy-code-btn`을 기본적으로 `opacity: 0`으로 숨깁니다.
   - 부모 `<pre>` 태그에 마우스가 호버(`:hover`)될 때 버튼이 `opacity: 1`이 되며 자연스럽게 나타납니다.
   - 인쇄 모드(`@media print`)에서는 버튼의 `display: none`이 강제 적용됩니다.
4. **복사 및 피드백**:
   - 버튼 클릭 시 이벤트 리스너가 작동하여 부모 `<pre>` 안의 `<code>` 요소 내 텍스트(`innerText`)를 클립보드에 복사합니다.
   - `navigator.clipboard.writeText`를 기본으로 사용하고 지원되지 않을 시 `document.execCommand('copy')`로 fallback 합니다.
   - 복사 완료 즉시 버튼의 텍스트를 `Copy`에서 `Copied!`로 변경하고 배경색을 강조 색상(예: `#00dddd`)으로 잠시 바꿉니다.
   - 2초 뒤 원상복구(타이머)합니다.

## 제약 사항 및 보수적 의사결정
- 외부 아이콘 라이브러리(FontAwesome 등)나 `reveal.js` 복사 플러그인을 일절 사용하지 않으며, 텍스트(Copy/Copied!)만으로 피드백을 전달하여 독립성을 보장합니다.
