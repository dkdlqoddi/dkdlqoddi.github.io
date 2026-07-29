# Work Report & Pre-Merge Quiz: Galaxy Rollback & Layer Separation

- 날짜: 2026-07-29
- 상태: 오리지널 은하계 롤백 및 다중 레이어 구조화 완료

## 작업 요약 (Implementation Summary)
1. **오리지널 은하 복구 (100% 롤백)**: `git checkout`을 통해 `b388df6` 시점의 코드로 회귀하여, 은하계를 그리던 기존 `PointsMaterial`과 Additive Blending 설정을 완벽하게 복구했습니다. 점들이 딱딱해지던 문제를 완전히 제거했습니다.
2. **거대 항성 분리 (Giant Stars Layer)**: 원본 은하를 훼손하지 않기 위해 별도의 `THREE.Points` 레이어를 만들고, `size`를 기존 대비 5배로 키운 300개의 굵직한 별들만 렌더링하도록 `generateGiantStars()` 함수를 신설했습니다.
3. **은하수 구름 분리 (Milky Way Layer)**: 거대 항성처럼 성운 또한 완전히 다른 `THREE.Points` 객체로 분리(`generateClouds()`)하여, 부피가 크지만 흐릿한 입자 2,000개를 은하계와 똑같은 속도로 회전(`clouds.rotation.y = elapsedTime * 0.04`)시켰습니다.
4. **혜성 복원 (Comets)**: 분리된 환경에서도 혜성 배열(Array)과 `LineBasicMaterial`이 정상 동작하도록, `initComets()`와 `updateComets()`를 `tick()` 함수 안에 안정적으로 이식했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 은하계를 구성하는 별들을 선명하게(원본) 유지하면서 거대 항성/성운 등 복잡한 효과를 넣기 위해, 본 작업에서 채택한 구조적 해법은 무엇입니까?**
1) 2D 캔버스와 3D 캔버스를 반반 섞어서 사용 (Z-index 교차)
2) 오리지널 코드는 그대로 두고, 추가 요소들은 각기 다른 `THREE.Points` 레이어(Layer)로 생성하여 `scene`에 겹치기
3) 모든 요소를 1개의 거대한 `ShaderMaterial` 셰이더 함수로 압축하여 렌더링
