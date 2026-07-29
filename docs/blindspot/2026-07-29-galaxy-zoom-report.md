# Work Report & Pre-Merge Quiz: Galaxy Zoom & Density Tuning

- 날짜: 2026-07-29
- 상태: 거대 항성 밀도 튜닝 및 마우스 휠 줌(Zoom) 기능 추가 완료

## 작업 요약 (Implementation Summary)
1. **거대 항성 밀도 축소 (Reduce Giant Stars Density)**: 화면을 꽉 채워 다소 답답하게 느껴졌던 거대 항성 레이어 배열을 수정했습니다. 3배~10배 크기의 항성들을 기존 1,500개에서 총 350개(`[200, 100, 30, 20]`) 수준으로 대폭 줄여, 배경의 여백과 맑은 원근감을 극대화했습니다.
2. **마우스 휠 줌 인/아웃 (Mouse Wheel Zoom)**: 
   - 고정되어 있던 카메라 반경을 가변 변수(`camRadius`, `targetCamRadius`)로 분리했습니다.
   - `window.addEventListener('wheel')`을 통해 마우스 휠 조작 시 `targetCamRadius` 값을 동적으로 증감시키며, 시야가 객체를 뚫고 지나가지 않도록 120에서 250 사이로 제한(Clamp)했습니다.
   - `tick()` 함수 안에서 부드러운 Lerp(보간)를 통해 매 프레임 구면 좌표를 갱신하도록 설계하여 매우 자연스러운 줌 효과를 완성했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 본 작업에서 마우스 휠을 한 번만 살짝 굴려도 카메라가 딱딱하게 끊기지 않고 부드럽게 줌(Zoom) 되도록(Lerp) 처리하기 위해 수식을 추가한 메인 렌더링 함수는 무엇입니까?**
1) `generateGalaxy()`
2) `generateGiantStars()`
3) `tick()`
