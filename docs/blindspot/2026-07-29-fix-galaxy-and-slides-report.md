# Work Report & Pre-Merge Quiz: 3D Galaxy Patch

- 날짜: 2026-07-29
- 상태: 버그 픽스 및 슬라이드 HTML 일괄 패치 완료

## 작업 요약 (Implementation Summary)
1. **Three.js 다운그레이드**: `file://` 환경에서 작동하지 않던 `ES Module` 제약을 풀기 위해, 모듈 방식을 사용하지 않는 `v0.150.0` 버전을 `vendor/three.js/three.min.js`에 덮어썼습니다.
2. **z-index 해결**: `styles.css`의 `z-index: -1`을 0으로 끌어올려, 브라우저가 그리는 검은 바탕 위에 3D 캔버스가 정상적으로 노출되게 수정했습니다.
3. **Python 자동화 패치**: 정규식을 활용하여 `slides/*/index.html` 폴더 내의 모든 HTML 파일을 순회하며 과거의 `.galaxy-bg` div 태그를 새로운 3D 캔버스와 자바스크립트 호출문으로 전부 교체했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 채팅으로 말씀해 주시면 즉시 깃 커밋(Commit) 프로세스를 진행합니다!

**Q. 랜딩 페이지에서 3D 은하수(Three.js)가 보이지 않았던 핵심 원인 중 하나로, 인터넷이 안 되는 환경이나 로컬 폴더에서 `index.html`을 더블클릭(`file://`)하여 열었을 때 브라우저 보안 정책(CORS)에 막혔기 때문이었습니다. 이 문제를 해결하기 위해 제가 취한 조치는 무엇인가요?**
1) 보안 정책을 강제로 무시하는 해킹 스크립트를 삽입했다.
2) ES Module 전용 최신 Three.js 대신, 모듈 구문 없이 작동하는 구버전 UMD 라이브러리(v0.150.0)로 파일을 교체하고 스크립트 방식(`import` 제거)을 바꿨다.
3) 랜딩 페이지의 모든 HTML 코드를 파이썬 언어로 재작성했다.
