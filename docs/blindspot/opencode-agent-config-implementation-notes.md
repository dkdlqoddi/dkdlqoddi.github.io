# '나만의 돌쇠 AI 만들기' opencode.json Agent 등록 슬라이드 구현 노트 (Implementation Notes)

- 대상: `slides/my-dolsoe-ai/index.html`
- 날짜: 2026-09-01

## 1. 신규 슬라이드 배치 및 내용 구성

- **위치**: 2단계 `dolsoe.md` (Slide 8) 바로 뒤 -> 신규 **Slide 9**로 배치 (전체 슬라이드 수 20장 -> 21장으로 증가).
- **마크업 구조**:
```html
<!-- ═══════════════════ SLIDE 9. 2단계 opencode.json에 Agent 등록하기 ═══════════════════ -->
<section>
  <p class="eyebrow">AGENT CONFIG</p>
  <h3>2단계 · opencode.json에 Agent 등록하기</h3>
  <div class="tool-tags">
    <span class="tag t-soft">CONFIG</span>
    <span class="tag t-hard">JSON</span>
    <span class="tag">OPENCODE.JSON</span>
  </div>

  <div class="cols-2">
    <div>
      <pre><code class="json"># opencode.json
{
  "agent": {
    "dolsoe": {
      "description": "EDA 매뉴얼 리서치 일꾼",
      "mode": "primary",
      "model": "codemate/CodeLLMPro",
      "skills": [
        "fetch-jedai-manual",
        "fetch-siemens-manual",
        "fetch-snps-manual"
      ]
    }
  }
}</code></pre>
    </div>
    <div>
      <div class="panel-card">
        <h4>프로젝트 전역 Agent 등록</h4>
        <p><code>opencode.json</code>에 정의하면 팀원 전체가 일관된 에이전트 환경을 공유합니다.</p>
      </div>
      <div class="panel-card">
        <h4>skills 명시적 바인딩</h4>
        <p>에이전트가 사용할 수 있는 스킬 목록을 한정하여 의도치 않은 도구 오용을 방지합니다.</p>
      </div>
      <div class="panel-card">
        <h4>.md 지시문과의 역할 분담</h4>
        <p><code>.md</code>는 행동 프롬프트, <code>json</code>은 모델·스킬·권한 등 시스템 인프라를 담당합니다.</p>
      </div>
    </div>
  </div>
</section>
```

- **높이 검증**: 헤더(85px) + 태그(25px) + JSON 코드(180px) + 패널 카드(180px) = 총 ~360px로 700px 캔버스 내 스크롤 없이 완벽 수용.
