# 다중 은하수 분산 배치 및 시차(Parallax) 애니메이션 Unknowns

- 날짜: 2026-07-28
- 입력: [2026-07-28-scattered-galaxy-requirements.md](file:///c:/Workspace/dkdlqoddi.github.io/docs/blindspot/2026-07-28-scattered-galaxy-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (출처) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | `similar-features` | 다중 은하 체제 전환 시 입자 생성을 어떻게 그룹화할 것인가? | 독립적인 `Galaxy` 객체(클래스)를 만들고, 화면의 정해진 고정 중심점과 Parallax 오프셋을 갖도록 리팩토링함. | 자체 해소 |
| 2 | `domain` | 파티클 렌더링 성능을 위해 Float32Array를 사용할 것인가, 객체 배열(AoS)을 쓸 것인가? | 파티클 100개 제한이 있어 JS 객체 배열로도 30fps 방어에 충분하므로 복잡도를 낮추기 위해 기존 객체 배열 유지. | 자체 해소 |
| 3 | `integration-points` | 창 리사이즈 이벤트 시 은하들의 좌표는 어떻게 재조정할 것인가? | 고정 좌표 픽셀 대신, `(0.1 ~ 0.9)`와 같이 비율(ratio) 단위로 원점을 저장하여 리사이즈마다 `canvas.width * ratio`로 픽셀을 재계산함. | 자체 해소 |

## 미해소 항목 (사용자 확인 필요)

| # | 질문 | 보류 이유 |
|---|---|---|
| 1 | 화면에 띄울 은하의 개수와 깊이감(Parallax): **은하를 3개 정도로 크게 띄우는 것이 좋을까요, 아니면 5~7개 정도로 작게 여러 개 띄우는 것이 좋을까요? (마우스 이동 시 움직이는 속도를 다르게 주어 입체감을 낼 예정입니다)** | 아키텍처나 성능보단 시각적 컨셉(디자인)에 큰 영향을 주며, 100개의 입자를 몇 개로 쪼갤지 결정하기 위함 |
