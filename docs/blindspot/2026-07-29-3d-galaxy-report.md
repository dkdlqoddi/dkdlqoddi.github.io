# Work Report & Pre-Merge Quiz: 3D Galaxy

- 날짜: 2026-07-29
- 상태: 구현 완료 및 승인 대기

## 작업 요약 (Implementation Summary)
1. **Three.js 도입**: 오프라인 제약 조건을 지키기 위해 `vendor/three.js/three.module.min.js`를 로컬로 다운로드 및 포함(Vendor)시켰습니다. 외부 네트워크(CDN) 의존성을 완벽히 제거했습니다.
2. **WebGL 은하수 렌더링**: `scripts/galaxy3d.js`를 추가하여, 대각선 위(Isometric) 시점에서 5만 개의 파티클을 나선형으로 흩뿌린 3D 은하수를 렌더링합니다.
3. **목차의 3D 공간 홀로그램화**: `index.html`의 목록(Cards) UI를 3D 공간 투영 좌표에 맞추어 절대 배치(`absolute`)했습니다. 은하가 회전할 때 원근법에 맞춰 텍스트 라벨들이 축소되고 이동합니다.
4. **접근성(Reduced Motion) 엣지 케이스 해소**: `prefers-reduced-motion`이 켜져 있을 때 `tick()` 함수 안에서 은하수 회전 파라미터가 멈추도록 예외 처리를 완료했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 채팅으로 말씀해 주시면, 통과 즉시 깃 커밋(Commit) 프로세스를 진행합니다!

**Q. 기존 `styles.css`에 있던 은하수 배경(galaxy-bg) 대신 새롭게 구현된 3D 은하수 기능에서, 발표 자료들을 나타내는 "홀로그램 텍스트 라벨"들은 은하수가 회전할 때 어떻게 보일까요?**
1) 화면의 특정 위치에 고정된 채, 뒤의 은하수 배경만 빙빙 돈다.
2) 은하수 내부의 특정 별 위치에 매핑되어, 은하수와 함께 3D 원근법이 적용되어 회전하며 다닌다.
3) 브라우저 마우스를 따라다니면서 화면 전체를 휘젓는다.
