# 발표자료 노출 버그 및 마우스 패럴랙스 제거 보고서

- 날짜: 2026-07-29
- 기준: main → HEAD
- 퀴즈: docs/blindspot/quiz/2026-07-29-parallax-removal.html — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.

## Human 섹션

### 요약

**1. 발표자료 가림 버그 픽스**
발표 슬라이드 화면에 접근했을 때 글자가 전혀 보이지 않고 까만 우주 캔버스만 덩그러니 뜨던 버그를 고쳤습니다. 원인은 슬라이드 파일 안에 옛날 배경 스타일 속성(`.deck-stars`)이 잔존해 있어, 새로 만든 캔버스(`.galaxy-bg`)가 고정되지 않고 화면 앞쪽에서 발표자료 컨테이너 전체를 화면 밖으로 밀어내버린 탓이었습니다. 모든 슬라이드 파일을 전수 조사하여 누락된 고정(Fixed) 및 비활성화(pointer-events: none) 속성을 씌웠습니다.

**2. 마우스 반응(패럴랙스) 완전히 제거**
은하수 배경이 마우스를 쫓아 움직여 어지럽거나 방해가 된다는 의견을 반영해 마우스 추적 기능을 완전히 빼버렸습니다. 이제 은하들은 처음 그려진 그 자리에서만 얌전하게 조용히 돌고 있습니다. 

### 리뷰 포인트 (개발자용)

- `scripts/galaxy.js` : 마우스 위치를 감지하던 `mousemove`, `touchmove`, `touchstart` 이벤트 리스너를 완전히 삭제하고, 오프셋 연산 변수들(`mouseTargetX`, `mouseLerpX` 등)을 소거했습니다.
- `slides/*/index.html` : 3개의 슬라이드 파일에 남아 있던 옛날 장식용 `.deck-stars` CSS 블록들을 덜어내고, 현재의 캔버스 클래스명인 `.galaxy-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }` 로 최신화했습니다.

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)
사용자의 피드백에 따라 배경을 '동적 패럴랙스'에서 '정적 자전 애니메이션'으로 너프(Nerf)시키고 시선을 온전히 발표 내용에 집중하게 만듭니다. 아울러 HTML/CSS 분리로 인해 발생한 CSS 누락 버그(Layout Push)를 고칩니다.

### 제약 (Constraints)
- 슬라이드 파일들은 `styles.css`를 로드하지 않고 각자 `<style>`을 인라인으로 내장하고 있습니다. 향후 랜딩페이지 CSS에 무언가 변경할 때마다 슬라이드 HTML들도 직접 수정해줘야 함을 잊지 않아야 합니다.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 미처 발견하지 못한 잔여 슬라이드 유무 | `grep_search` 툴로 `slides/` 폴더 하위를 전수 조회하여, `.deck-stars`가 남아있는 `cds-agentic-architecture`, `cds-agentic-work`, `sample` 총 3개 폴더를 모두 픽스함. |
| 모션 저감 환경(prefers-reduced-motion) | 기존에 슬라이드 쪽에 있던 `.deck-stars` 정지용 CSS가 날아가면서 문제가 생길 수 있으나, 이미 `scripts/galaxy.js` 내부에서 모션 저감을 직접 JS 레벨에서 관측하고 캔버스 `requestAnimationFrame`을 끊어버리도록 대응되어 있으므로 CSS 없이도 완벽히 호환됨. |
