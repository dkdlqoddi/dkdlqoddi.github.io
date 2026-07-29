# Work Report & Pre-Merge Quiz: Scroll Lock & Galaxy Enhancements

- 날짜: 2026-07-29
- 상태: 랜딩 페이지 스크롤 차단 및 우주 배경 고도화 완료

## 작업 요약 (Implementation Summary)
1. **스크롤 잠금 (Scroll Lock)**: `styles.css`의 `html, body` 태그에 `overflow: hidden; touch-action: none; height: 100vh;` 속성을 강제 적용하여, 랜딩 페이지에서는 오직 마우스/터치를 통한 3D 궤도 탐색에만 온전히 집중할 수 있도록 만들었습니다.
2. **거대 항성 (Giant Stars)**: 외부 이미지 사용 없이, 순수 수학적 `ShaderMaterial`을 도입했습니다. 기존 점 입자(Point)들에 `aScale` 속성을 난수로 부여해, 1%의 확률로 거대하게 빛나는 별과 5% 확률의 밝은 별들을 은하계 곳곳에 흩뿌렸습니다.
3. **은하수 먼지 구름 (Milky Way Dust)**: 은하 나선팔을 따라 투명도를 극도로 낮추고 렌더링 크기를 크게 키운(Volumetric Particle) 입자 2,000개를 겹쳐 그려, 신비롭고 거대한 우주 먼지 구름(Nebula)을 연출했습니다.
4. **혜성 (Comets)**: `requestAnimationFrame` 사이클 내에서 자체적인 수명(Life) 주기와 속도를 가진 `LineBasicMaterial` 기반의 혜성 객체 5개를 생성했습니다. 일정 프레임의 과거 위치(History)를 선으로 이어 꼬리(Trail)를 남기며 화면을 가로지르도록 구현했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 본 작업에서 '은하수 구름'과 '거대 항성'을 묘사하기 위해 성능과 퀄리티를 동시에 잡은 렌더링 기법은 무엇입니까?**
1) 외부 서버(CDN)에서 고해상도 PNG 텍스처 불러오기
2) HTML Canvas API의 2D `ctx.arc()` 반복 그리기
3) Three.js 커스텀 `ShaderMaterial`을 활용한 절차적(Procedural) 렌더링
