# Work Report & Pre-Merge Quiz: Scroll Alignment & Intro Animation

- 날짜: 2026-07-29
- 상태: 스크롤 정렬 버그 수정 및 스크롤 등장 애니메이션(Fade-in) 구현 완료

## 작업 요약 (Implementation Summary)
1. **스크롤 오차 버그 완벽 해결**: 기존에 `.cards` 컨테이너가 `position: absolute`로 설정되어 문서 스크롤에 따라 위아래로 움직이면서 3D 은하수 좌표계와 틀어지는 현상이 있었습니다. 3D 은하수 캔버스와 동일하게 `.cards` 컨테이너를 `position: fixed`로 변경함으로써 스크롤 위치와 무관하게 2D 투영 좌표와 완벽히 맞물리도록 수정했습니다.
2. **도입부 버튼 숨김 (Fade-in 등장)**: 사이트 첫 진입 시(스크롤 최상단)에는 `.cards`를 숨겨두어(`opacity: 0, visibility: hidden`) "발표 기록" 타이틀과 은하수 배경만 깔끔하게 보이게 했습니다. 이후 `main.js`의 `window.addEventListener('scroll')` 로직을 통해 스크롤이 조금이라도 내려가면 `body`에 `scrolled` 클래스를 부여하고, CSS 트랜지션을 통해 버튼들이 스르륵(Fade-in) 나타나도록 고급스러운 연출을 적용했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 즉시 깃 커밋(Commit) 프로세스를 진행합니다!

**Q. 화면 스크롤을 내릴 때마다 3D 우주(Canvas)와 발표 자료 버튼(HTML)의 위치가 틀어지던 버그를 완벽하게 잡아낸 가장 핵심적인 CSS 조치는 무엇이었나요?**
1) 버튼 컨테이너를 우주 배경과 똑같이 화면에 찰싹 붙어있게 만드는 `position: fixed` 속성으로 변경했다.
2) HTML 컨테이너에 `z-index: 9999`를 줘서 무조건 제일 위에 뜨도록 만들었다.
3) 스크롤을 감지할 때마다 자바스크립트로 버튼의 `margin-top` 값을 실시간으로 더해주어 강제로 끼워 맞췄다.
