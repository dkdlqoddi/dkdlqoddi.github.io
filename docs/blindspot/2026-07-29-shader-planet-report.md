# Work Report & Pre-Merge Quiz: Shader Planet Hover

- 날짜: 2026-07-29
- 상태: GLSL 셰이더를 이용한 고품질 행성 호버 효과 구현 완료

## 작업 요약 (Implementation Summary)
1. **GLSL 셰이더(ShaderMaterial) 구현**: 외부 이미지 파일 없이 수학적으로 질감과 대기 효과를 그릴 수 있는 `planetVertexShader` 및 `planetFragmentShader`를 작성하여 `MeshBasicMaterial`을 대체했습니다.
2. **시드 기반의 다양한 행성 무늬 (`uSeed`)**: 각 발표자료 버튼과 연결된 행성마다 0~100 사이의 임의의 시드 값을 `uSeed` uniform 변수로 넘겨주어, 색상 톤(파랑~보라)과 가스 소용돌이(FBM Noise) 패턴이 모두 다르게 생성되도록 구현했습니다.
3. **부드러운 시각적 전환 (`uHover`)**: `tick()` 렌더링 루프 내부에서 마우스가 호버(`isHovered`)되었는지 여부에 따라 셰이더의 `uHover` 변수를 0.0에서 1.0으로 보간(lerp) 처리했습니다. 이를 통해 평상시에는 단순한 파란 점(마커)이었다가, 마우스를 올리는 순간 대기권 엣지 글로우(Fresnel Glow)가 있는 고품질 행성으로 부드럽게 팽창(Scale 3.5)하며 변신합니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 즉시 깃 커밋(Commit) 프로세스를 진행합니다!

**Q. 발표자료마다 행성들의 가스 소용돌이 무늬와 색상 톤(파랑~보라)이 서로 다르게 나타날 수 있는 핵심적인 이유는 무엇일까요?**
1) 행성이 렌더링될 때마다 외부 서버(API)에 요청하여 서로 다른 무작위 행성 사진 텍스처를 다운로드 받아 입혔다.
2) 각 행성 객체(Material)를 생성할 때 `uSeed`라는 고유한 난수(Random) 변수를 셰이더에 전달하고, 셰이더 내부 수식이 이 시드 값을 기반으로 서로 다른 노이즈(Noise) 패턴과 색조를 계산해냈기 때문이다.
3) HTML/CSS에 미리 만들어둔 여러 개의 행성 CSS 클래스를 랜덤하게 부여하여 디자인을 바꿨다.
