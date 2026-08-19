# Explainer: AI Agent Skills Philosophy Reordering

이 문서는 `ai-agent-skills-philosophy` 발표 덱 내의 "플러그인/에이전트" 슬라이드들을 어떤 기준과 순서로 재배치했는지 설명합니다.

## 1. 재배치 배경
사용자의 요청에 따라, AI 코딩 도구들을 '단순한 기능의 플러그인(규칙/게이트)'부터 '복잡하고 완성도 높은 시스템(오케스트레이터 및 플랫폼)' 순으로 나열하여, 발표의 흐름이 기능적 단순함에서 구조적 거대함으로 자연스럽게 이어지도록 재구성합니다.

## 2. 슬라이드 분류 및 정렬 기준

### Group A: 단일 규칙 및 방어 게이트 (가장 단순, 앞쪽 배치)
단일 목적을 가진 좁은 범위(Narrow Scope)의 도구들입니다.
- **ponytail**: 코드 작성 전 YAGNI 여부를 판단하는 매우 얇은 필터/게이트.
- **fablize**: 결과물 반환 직전 "증거"를 요구하는 검증 게이트.
- **grill-me**: 구현 직전 핑퐁식 질문(Decision Tree) 루프를 돌리는 플러그인.

### Group B: 워크플로우 프레임워크 (중간 복잡도)
여러 단계나 규칙들을 묶어 하나의 파이프라인으로 강제하는 도구들입니다.
- **blindspot-flow**: 인터뷰-미지영역-명세화-퀴즈로 이어지는 4단계 프로세스 룰셋.
- **superpower**: [구상 -> 계획 -> 실행 -> TDD]로 이어지는 엄격한 3~4단계 파이프라인.

### Group C: 시스템 오케스트레이터 및 플랫폼 (복잡도 상, 뒤쪽 배치)
단순한 룰을 넘어, 다수의 외부 도구와 환경을 결합하고 복합적인 추론 및 자율 실행을 담당하는 아키텍처들입니다.
- **oh-my-opencode**: LSP, 정적분석, Librarian 등을 연결해 병렬 작업하는 오케스트레이터.
- **LangChain Data Agent**: ReAct 라우터를 통해 다수의 외부 API와 연동하는 시스템.
- **Aider**: 터미널과 Git 환경을 자율적으로 통제하며 페어 프로그래밍을 수행.
- **Copilot Workspace**: GitHub 이슈부터 Pull Request 생성까지 클라우드 기반 엔드투엔드 처리.
- **Devin**: 브라우저, 에디터, 터미널 샌드박스를 모두 내장하고 완전히 격리된 환경에서 임무를 자율 수행하는 끝판왕.

## 3. 최종 재배치 순서
1. 커버 슬라이드 (Cover)
2. ponytail
3. fablize
4. grill-me
5. blindspot-flow
6. superpower
7. oh-my-opencode
8. LangChain Data Agent
9. Aider
10. Copilot Workspace
11. Devin
