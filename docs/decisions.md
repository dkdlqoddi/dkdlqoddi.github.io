# 결정 기록

<!-- Append-only: one decision per row, one line per row, newest at the bottom; supersede a row by appending a new one instead of editing it. 영역: frontend, backend, core, or a module name. 결정 주체: 사용자 or 자체. Every row starts with "| 20" so grep finds it. -->

| 날짜 | 영역 | 결정 | 근거 | 기각한 대안 | 결정 주체 |
|---|---|---|---|---|---|
| 2026-09-20 | agent-tools-antigravity/배치 | 새 교육 자료는 slides/agent-tools-antigravity/에 독립 덱으로 만들고 slides.json에 등록한다. | 사용자가 기존 구조의 후속 작업을 예고함; slides.json:1, main.js:54의 공개 목록 연결을 유지하는 최소 통합 | 기존 랜딩 및 기존 덱 전면 교체 | 자체 |
| 2026-09-20 | agent-tools-antigravity/디자인 | 흰 배경, 큰 한글, 짧은 문장, HTML/SVG 도식과 전용 CSS를 사용하고 공통 다크 CSS는 불러오지 않는다. | 사용자 명시 요구 우선; slides/shared/deck-base.css:15의 다크 토큰과 충돌; 외부 이미지 없이 시각적 설명 가능 | 기존 우주 테마 재사용, 공통 CSS 전체 변경, 외부 이미지 임베드 | 사용자 |
| 2026-09-20 | agent-tools-antigravity/교육 | 프롬프트에서 파일 작업을 하는 에이전트로의 확장, 세 제품의 공통 원리와 차이, Antigravity로 모임 안내 페이지를 만드는 실습을 한 흐름으로 설명한다. | 이미 프롬프트를 사용하는 비개발자 대상; 실습 결과를 직접 눈으로 확인할 수 있는 작은 HTML 파일 선택 | 개발 용어 중심 강의, 세 제품 설치를 모두 실습, Antigravity가 두 제품의 모든 기능을 포함한다는 단정 | 자체 |
| 2026-09-20 | agent-tools-antigravity/제품기준 | 2026-09-20 공식 문서에 맞춰 Antigravity 2.0 데스크톱을 실습 기준으로 삼고 IDE의 폴더 열기 차이는 진행 메모에서 안내한다. 화면은 학습용 모형이라고 표시하며 출처와 확인일을 제공한다. | antigravity.google/docs/getting-started는 2.0과 IDE를 구분하며 New Project, Add Folder, Create 흐름을 안내; OpenAI 및 Anthropic 공식 문서 확인 | 불명확한 버전의 화면을 실제 캡처처럼 제시, 기능 순위 및 고정 요금 단정 | 자체 |
| 2026-09-20 | agent-tools-antigravity/접근성 | 발표 본문은 32px 이상을 기본으로 하며 한 장에 한 주제를 담는다. 큰 이동 버튼, 목차, 키보드, 모바일 읽기 모드, 동작 축소, 도식 대체 설명, PDF 인쇄를 제공한다. | 60대 이상 대상 요구; slides/shared/deck-base.css:57의 기존 하한 및 :167의 내부 스크롤을 개선; slides/sample/index.html:167의 인쇄 설정 참고 | 글자를 줄여 한 장에 압축, 자동 진행, 색상만으로 구분 | 자체 |
| 2026-09-20 | agent-tools-antigravity/검증 | 로컬 Reveal와 글꼴을 사용하고 파일 직접 열기, HTTP, 화면 넘침, 이동·복사·목차, 모바일, 인쇄를 실제 브라우저에서 확인한다. | scripts/verify_deck.py:17 이후는 기존 특정 덱만 검증; main.js:54의 랜딩 fetch는 file://에서 보장되지 않으므로 오프라인은 새 덱 index.html 직접 열기로 확인 | 기존 전용 검증 통과만으로 새 덱 검증을 대체, 전역 검증기 개편 | 자체 |
| 2026-09-20 | agent-tools-antigravity/오프라인 | 파일 직접 열기에서는 복사 버튼이 문장을 선택하고 복사 단축키를 안내한다. 웹 주소에서는 클립보드 복사를 시도하되 거부 시 같은 대체 경로를 제공한다. | 브라우저 실측에서 file:// 클립보드 요청은 권한 대기 상태가 될 수 있음; 독립 자료의 오프라인 사용성을 유지하는 보수적 선택 | 파일 모드에서도 클립보드 권한 승인을 무기한 기다리기 | 자체 |
| 2026-09-20 | agent-tools-antigravity/인쇄 | Reveal의 구조 CSS는 화면에만 적용하고 인쇄에는 덱 전용 16:9 스타일을 사용한다. | 실제 PDF 검증에서 Reveal의 기본 인쇄 규칙이 grid를 block으로 바꾸어 22장을 42쪽으로 분할함; vendor 원본 수정 없이 충돌 제거 | 전역 Reveal CSS 수정, 분할된 PDF를 그대로 제공 | 자체 |
| 2026-09-20 | agent-tools-antigravity/산출물 | 웹 발표 자료와 단일 파일 실습 예시에 더해, 동일 내용의 22쪽 PDF를 덱 폴더에 함께 제공한다. 인쇄본 퀴즈에는 정답을 표시한다. | 비개발자·고령 학습자가 바로 열고 공유할 수 있도록 브라우저 인쇄 결과를 산출물로 저장; PDF에서는 버튼 조작이 불가능함 | PDF를 별도 도구로 재작성, 인쇄본에 클릭해야만 보이는 정답 누락 | 자체 |
