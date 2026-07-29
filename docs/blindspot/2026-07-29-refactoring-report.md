# Work Report & Pre-Merge Quiz: Codebase Refactoring

- 날짜: 2026-07-29
- 상태: 전체 코드 리팩토링 및 3D 엔진 최적화 구현 완료

## 작업 요약 (Implementation Summary)
1. **성능 개선**: `galaxy3d.js`에서 초당 60프레임마다 SVG 문자열을 덮어쓰던 비효율을 걷어내고 `<line>`, `<circle>` 객체를 한 번만 캐싱하여 좌표 속성만 갱신하도록 최적화했습니다 (Layout Thrashing 방지).
2. **모바일 및 마우스 컨트롤 확장**: 마우스 좌클릭 시점 이동을 추가하고 모바일 환경을 위한 `touchstart`, `touchmove`, `touchend` 터치 제어를 완벽히 지원합니다.
3. **접근성(A11y) 버그 수정**: 시점 회전으로 카메라(화면) 뒤로 넘어가버린 발표 자료 요소들에 `visibility: hidden` 처리를 부여하여 시각장애인용 스크린 리더기나 탭(Tab) 키 이동에서 완전히 배제되도록 픽스했습니다.
4. **로딩 동기화 이벤트 기반 설계**: DOM 로드를 기다리던 폴링(무한 타이머)과 `main.js`의 `IntersectionObserver`를 모조리 지우고, 카드 렌더링 직후 단발성 이벤트(`cards-rendered`) 하나를 통해 통신하도록 결합도를 낮추었습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 기존 방식에서는 프레임(FPS)을 깎아먹는 'Layout Thrashing'을 유발하고 있었습니다. 이번 리팩토링에서 이를 어떻게 해결했을까요?**
1) SVG 애니메이션 자체를 포기하고 3D 캔버스(Three.js) 안에 HTML Canvas API를 섞어서 선을 그렸다.
2) 카드가 로딩될 때 필요한 SVG 요소를 미리 한 번만 전부 생성해 DOM에 붙여놓고, 렌더링 루프에서는 `.setAttribute()`로 각 요소의 x/y 좌표만 갱신하게 변경했다.
3) SVG를 그리는 로직의 호출 주기를 초당 60회에서 초당 1회로 극단적으로 줄였다.
