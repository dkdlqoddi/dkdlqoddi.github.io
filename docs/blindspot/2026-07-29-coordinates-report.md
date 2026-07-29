# Work Report & Pre-Merge Quiz: Spatial Sensor Coordinates

- 날짜: 2026-07-29
- 상태: Landing Page의 'LOG INDEX' 요소들을 역할에 맞게 개편 완료

## 작업 요약 (Implementation Summary)
1. **타이틀 변경**: 더 이상 쓰이지 않던 `LOG INDEX` 텍스트를 현재 3D HUD 컨셉에 맞추어 `SPATIAL SENSOR`로 수정했습니다.
2. **동적 좌표 추적 로직 추가**: 단순히 전체 카드 개수(`02 ENTRIES`)를 보여주던 우측 텍스트를 마우스 위치에 반응하는 동적 위도/경도 표시기(Tracker)로 리팩토링했습니다.
   - 마우스의 가로축(X) 이동을 경도(Longitude: -180 ~ 180, E/W)로 매핑
   - 마우스의 세로축(Y) 이동을 위도(Latitude: -90 ~ 90, N/S)로 매핑
3. **성능 최적화(FPS 방어)**: 마우스가 미세하게 1px만 움직일 때마다 DOM을 변경하면 렉이 생기므로, `requestAnimationFrame`을 사용하여 브라우저 화면 갱신 주기에 맞춰서만 부드럽게 좌표 글자가 바뀌도록 최적화했습니다.
4. **시각적 흔들림(Layout Shift) 방지**: 숫자('1'과 '8' 등)의 폭 차이 때문에 숫자가 바뀔 때마다 전체 줄이 바르르 떨리는 현상을 막고자, CSS에 `font-variant-numeric: tabular-nums` 옵션을 적용해 고정폭 숫자 렌더링을 구현했습니다.
5. **푸터 정리**: 하단 푸터(Footer) 영역에 남아있던 하드코딩된 정적 위치(`37.53°N · 127.02°E`)는 역할이 겹치므로 제거했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 마우스가 아주 빠르게 움직일 때, 무작정 텍스트를 변경하면 브라우저 렌더링 렉이 생깁니다. 이를 방지하기 위해 브라우저의 화면 주사율(보통 60Hz)에 맞춰서만 화면을 부드럽게 갱신하게 만드는 내장 API는 무엇일까요?**
1) `setTimeout()`
2) `setInterval()`
3) `window.requestAnimationFrame()`
