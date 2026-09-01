# '나만의 돌쇠 AI 만들기' 전 슬라이드 No-Scroll 및 UI/UX 템플릿 디자인 고도화 요구사항 정의서 (v2)

- 문서 ID: 2026-09-01-my-dolsoe-ai-no-scroll-v2-requirements
- 대상 슬러그: `my-dolsoe-ai`
- 날짜: 2026-09-01

## 1. 목적 및 배경
`my-dolsoe-ai` 20개 슬라이드 전체를 면밀히 점검하여, 일부 슬라이드(코드 블록 및 카드 패널 높이 초과)에서 발생하는 세로 스크롤을 완전히 박멸하고, 저장소 표준 템플릿 디자인(`sample`, `ai-agent-skills-philosophy`, `deck-base.css`) 요소(태그 배지, 요약 박스, 미니 다이어그램, HUD 연동 등)를 적극 반영하여 UI/UX 및 가독성을 극대화합니다.

## 2. 세부 요구사항

### 2.1 20개 슬라이드 No-Scroll 높이 예산 규격화 (엄격 적용)
- **전체 슬라이드 높이 상한**: 960×700 뷰포트 내에서 실제 컨텐츠 높이가 **480px 이하**가 되도록 통제 (reveal.js 상하 여백 및 센터링 여유 220px 확보).
- **타이포그래피 스케일 최적화**:
  - `h2`: `1.50em` (margin: 0 0 10px 0)
  - `h3`: `1.15em` (margin: 0 0 6px 0)
  - `p.eyebrow`: `0.45em` (margin: 0 0 4px 0)
  - `p.small`: `0.47em` (margin: 0 0 8px 0)
- **코드 블록 밀도 및 라인 수 최적화**:
  - `pre font-size`: `0.46em` (18.4px), `line-height: 1.22`, `padding: 0.45em 0.7em`
  - 프론트매터 및 지시문 축약(불필요한 줄바꿈/여백 정리)을 통해 코드 라인 수를 7~11줄 이내로 압축.
- **카드 패널 최적화**:
  - `.panel-card`: `padding: 6px 10px; margin-bottom: 5px;`
  - `h4`: `0.60em`, `p`: `0.46em`, `line-height: 1.30`

### 2.2 UI/UX 및 템플릿 디자인 요소 적용
1. **도구 배지 & 태그 (`.tool-tags`, `.tag`)**:
   - 상단 또는 헤더 아래에 템플릿 규격의 태그 배지(`PROMPT`, `MCP TOOL`, `OFFLINE`)를 배치하여 시각적 위계 부여.
2. **요약 박스 (`.summary-box`)**:
   - 중요 안내 슬라이드에 좌측 액센트 라인(`border-left: 3px solid var(--accent)`) 요약 박스 적용.
3. **SVG 다이어그램 및 미니 다이어그램 가독성**:
   - `viewBox` 높이 예산 준수 및 `currentColor`, `.bright`, `.accent`, `.dim` 클래스로 다크 스페이스 테마와 완벽 일치.

### 2.3 전체 내용 및 일관성 리뷰
- 3대 EDA MCP(`jedai`, `Siemens_MCP`, `SNPS_MCP`)를 프롬프트로 직접 호출하는 아키텍처의 일관성 유지.
- 돌쇠, 개똥이, 마름, 언년이의 역할 분담 및 피드백 루프(Flow & Loop) 완결성 검토.
- 한국어 줄바꿈 가독성(`word-break: keep-all`, `<br>` 활용) 정밀 점검.

### 2.4 제약사항
- 0개 외부 CDN, 오프라인 자기완결성 100% 준수.
- 템플릿 코드 복사 버튼 기능 정상 작동.
