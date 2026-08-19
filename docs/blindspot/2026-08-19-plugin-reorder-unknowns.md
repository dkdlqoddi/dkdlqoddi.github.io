# Unknowns: AI Agent Skills Philosophy Reordering

## 1. Domain Unknowns (도메인 지식 미지 영역)
- **'단순한 플러그인'과 '복잡한 완성도 높은 시스템'의 명확한 경계 및 기준은 무엇인가?**
  - *해소 방안*: 단일 조건문/인터뷰 수준의 좁은 범위(Narrow Scope)를 가지는 툴(예: `ponytail`, `fablize`, `grill-me`)을 '단순' 그룹으로 분류하고, 이를 묶어 하나의 파이프라인으로 구성하는 프레임워크(`blindspot-flow`, `superpower`)를 '중간' 그룹으로 분류하며, 최종적으로 여러 도구를 통제하고 완전 자율 실행을 목표로 하는 거대 오케스트레이터 및 플랫폼(`oh-my-opencode`, `LangChain`, `Aider`, `Copilot Workspace`, `Devin`)을 '복잡/완성도 높음' 그룹으로 재배열합니다.

## 2. Implementation Unknowns (구현 미지 영역)
- **HTML 구조 내에서의 슬라이드 블록 이동 시 태그 꼬임 방지**: 각 슬라이드는 `<!-- N. name -->` 주석부터 `</section>`까지의 블록 구조를 가지고 있습니다. 이 큰 덩어리들을 정규표현식이나 스크립트로 분리하여 안전하게 재조립할 방법이 있는가?
  - *해소 방안*: `bs4`(BeautifulSoup)과 같은 파이썬 라이브러리를 활용하거나, 정규식을 조심스럽게 사용하여 각 `<section>` 블록을 리스트로 파싱한 뒤, 원하는 인덱스 순서로 재결합하여 덮어쓰는 스크립트를 작성합니다. 이번 경우에는 정규식과 주석을 활용한 분리 방식을 사용합니다.
