# Work Report & Pre-Merge Quiz: Galaxy Tuning

- 날짜: 2026-07-29
- 상태: 은하계 구름 제거 및 항성/혜성 고도화 완료

## 작업 요약 (Implementation Summary)
1. **먼지 구름 제거 (Remove Clouds)**: 코드를 어지럽히고 우주의 선명도를 낮추던 `generateClouds()` 로직 및 구름용 셰이더 변수, `tick()` 내의 렌더링 호출을 모두 깔끔하게 삭제했습니다.
2. **다층적 거대 항성 배치 (Multi-Layer Giant Stars)**: 거대 항성을 단일 크기(5배)로 생성하던 구조에서 벗어나, [3배(800개), 5배(400개), 7배(200개), 10배(100개)] 크기를 가진 4개의 별도 `THREE.Points` 레이어로 분할 생성했습니다. 총 1,500개의 별이 다양한 크기로 흩뿌려져 밤하늘의 원근감이 대폭 상승했습니다.
3. **유성우 폭격 (Enhanced Comets)**: 혜성의 동시 유지 갯수를 5개에서 20개로 크게 늘렸습니다. 또한 속도(`vel`) 계산 시 승수(Multiplier)에 랜덤 제곱식을 추가하여, 빠르고 긴 꼬리를 남기는 혜성과 느리게 떨어지는 혜성이 섞이도록 무작위성을 부여했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 서로 다른 크기(3x, 5x, 7x, 10x)의 거대 항성 1,500개를 생성하면서 원본 은하의 부드러운 불빛 느낌(Additive Blending)을 그대로 유지하기 위해 사용한 방법은 무엇입니까?**
1) 복잡한 커스텀 ShaderMaterial을 작성하여 점의 모양을 직접 계산
2) 크기별로 각기 다른 4개의 `THREE.PointsMaterial` 및 `THREE.Points` 객체(레이어)를 생성하여 겹쳐 그리기
3) 모든 입자를 하나의 Material로 묶고 크기를 통일시키기
