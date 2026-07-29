# Work Report & Pre-Merge Quiz: Scroll Dependency Removal

- 날짜: 2026-07-29
- 상태: Landing Page의 스크롤 연동 조건 제거 및 자동 로딩 렌더링 전환 완료

## 작업 요약 (Implementation Summary)
1. **스크롤 큐 텍스트 삭제**: `index.html`에서 불필요해진 `SCROLL ↓` 문구를 영구적으로 제거했습니다.
2. **스크롤 이벤트 리스너 제거**: 브라우저의 부하를 유발할 수 있는 `window.addEventListener('scroll')` 로직을 `main.js`에서 완전히 삭제했습니다.
3. **자동 페이드인 적용**: 데이터를 불러와 DOM(문서 객체 모델) 요소 생성이 끝난 직후, `setTimeout`을 통해 0.1초 뒤 즉시 `.scrolled` 클래스를 부착하도록 변경했습니다. 이를 통해 사용자가 스크롤을 조작하지 않아도 부드럽게 UI가 페이드인 되며 즉각 시야에 들어오게 됩니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 사용자가 접속했을 때, 마커와 카드들이 너무 밋밋하게 바로 뜨지 않고 0.5초 동안 서서히 밝아지며 나타나는 '부드러운 페이드인' 효과는 어떤 코드를 통해 제어되고 있을까요?**
1) JavaScript의 `requestAnimationFrame()` 안에서 opacity(투명도) 값을 0.01씩 수동으로 더해서
2) CSS에 정의된 `transition: opacity 0.5s ease;` 애니메이션 속성과, 자바스크립트가 붙여준 `.scrolled` 클래스의 조합으로
3) HTML의 `<canvas>` 요소가 가진 기본 브라우저 내장 효과로
