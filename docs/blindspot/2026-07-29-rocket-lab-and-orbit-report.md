# Work Report & Pre-Merge Quiz: UI Orbit & Theme Unification

- 날짜: 2026-07-29
- 상태: 마우스 휠 시점 제어, 버튼 공전 궤도, 우주선 삭제, 모든 슬라이드 HUD 적용 완료

## 작업 요약 (Implementation Summary)
1. **마우스 휠 시점 제어**: `scripts/galaxy3d.js`에서 기존 패럴랙스 코드를 지우고, `mousedown (button === 1)` 이벤트로 드래그 상태를 추적하여 구면 좌표계(Spherical)로 카메라의 위치(`targetCameraX, Y, Z`)를 계산하도록 수정했습니다.
2. **UI 공전 복구 및 선 길이 조정**: `.cards`의 사이드바 스타일을 지우고 3D 화면 위에 절대 위치로 복원했습니다. 그리고 행성 중심 좌표(`startX, startY`)에서 대각선으로 멀리 떨어진 픽셀(`offsetX = 150`, `offsetY = -100`)을 끝점으로 잡아 긴 연결선을 그렸고, 별이 은하수를 돌면 버튼도 함께 화면 밖으로 공전하도록 만들었습니다.
3. **슬라이드 테마 통일**: `patch_slides.py`를 실행하여 모든 `slides/*/index.html` 내부에 랜딩 페이지와 동일한 `<div class="hud">...</div>` (EVA VIEW) 태그와 관련 CSS 디자인, 그리고 Montserrat 폰트 강제 적용 코드를 주입했습니다. 슬라이드의 고유 애니메이션(Reveal.js 기본)은 보존했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 즉시 깃 커밋(Commit) 프로세스를 진행합니다!

**Q. 랜딩 페이지에 띄웠던 'EVA VIEW' 같은 HUD 계기판 장식들을 모든 발표 슬라이드에도 띄우기 위해 사용한 방법은 무엇인가요?**
1) 각각의 슬라이드 폴더 안에 들어가서 수동으로 HTML 태그와 CSS 코드를 일일이 복사해서 붙여넣었다.
2) `styles.css` 파일을 모든 슬라이드에서 `<link>` 태그로 무작정 불러오도록 수정했다.
3) 파이썬 자동화 스크립트(`patch_slides.py`)를 수정하고 실행하여, 모든 `slides/*/index.html` 파일 내부 적절한 위치에 HUD 관련 HTML 태그와 폰트 CSS 코드를 일괄적으로 주입(Inject)시켰다.
