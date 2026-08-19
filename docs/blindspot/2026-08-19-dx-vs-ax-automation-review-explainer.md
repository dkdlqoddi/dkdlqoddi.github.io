# Explainer: DX vs AX Automation Code Review & Restructuring

## 개요
이 문서는 `slides/dx-vs-ax-automation/index.html` 발표 자료의 4가지 사내 LLM 연동 방법 슬라이드를 재배치하고 코드를 보강하는 작업의 명세서입니다. 
사용자의 지시에 따라 난이도가 가장 낮은 순서부터 가장 어려운 순서(추상화 및 학습 난이도 기준)로 재배열하며, 각 슬라이드의 코드 예시를 복사 후 즉시 실행할 수 있는 수준으로 보강합니다.

## 슬라이드 재배열 기준 (순서)
기존 순서는 `1. subprocess` ➔ `2. Langchain` ➔ `3. OpenAI SDK` ➔ `4. HTTP` 였습니다. 이를 다음 순서로 변경합니다:

1. **방법 1 (난이도: 최하)**: `subprocess + opencode`
   - *이유*: CLI 도구만 설치되어 있으면 코딩 지식이 거의 없어도 터미널 명령어 한 줄로 실행 가능. 설정이 가장 직관적임.
2. **방법 2 (난이도: 하)**: `HTTP 직접 호출 (requests)`
   - *이유*: 언어나 라이브러리에 종속되지 않는 웹 프로그래밍의 가장 기본. `requests` 패키지 하나만으로 투명하게 통신함.
3. **방법 3 (난이도: 중)**: `OpenAI SDK 직접 사용`
   - *이유*: 공식 SDK의 구조(`client.chat.completions.create`)와 파라미터 규격을 학습해야 함.
4. **방법 4 (난이도: 상)**: `Langchain + 사내 LLM`
   - *이유*: 체인(Chain), 프롬프트 템플릿(PromptTemplate), 출력 파서(OutputParser) 등 고도의 추상화 프레임워크 학습이 필수적임.

## 코드 보강 계획
- 각 코드 블록(`<pre><code>`)에 다음 요소를 추가합니다.
  - 가상의 셋업 주석 (`# pip install ...` 등)
  - 인증 및 설정 주석 (`# 사내망 환경변수 세팅` 등)
  - 완결성 있는 코드 (import 문부터 print 문까지)
  - 기대 출력 결과 주석 (`# 출력 예시: ...`)

## 아티팩트 리뷰 문서
- 재배치가 끝난 후, 모든 페이지(슬라이드)의 가독성, 논리 흐름, 텍스트와 다이어그램의 균형을 리뷰하여 `dx-vs-ax-automation-review.md` 별도 아티팩트로 제출합니다.
