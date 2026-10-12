/* The archive is an ordinary list; its links do not depend on Galaxy rendering. */
(() => {
  'use strict';
  const grid = document.getElementById('cards');
  const expertGrid = document.getElementById('expert-cards');
  const status = document.getElementById('status');
  const count = document.getElementById('log-count');
  const tones = ['var(--lime)', 'var(--lavender)', 'var(--peach)', 'var(--green)'];
  const symbols = ['↗', '✳', '⌘', '↔', '◇', '↗'];

  function buildCard(item, order) {
    const card = document.createElement('li');
    card.className = 'card';
    card.dataset.chalkGroup = 'sequence';
    card.style.setProperty('--card-tone', tones[order % tones.length]);
    const top = document.createElement('div');
    top.className = 'card-top';
    const index = document.createElement('span');
    index.className = 'card-index';
    index.textContent = item.module;
    const date = document.createElement('time');
    date.dateTime = item.date;
    date.textContent = item.date.replaceAll('-', '.');
    top.append(index, date);
    if (item.module === 'N1' || item.module === 'E0') {
      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = '시작';
      top.append(badge);
    }
    const icon = document.createElement('span');
    icon.className = 'card-icon';
    icon.dataset.chalk = 'fade';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = symbols[order % symbols.length];
    const title = document.createElement('h3');
    title.className = 'card-title';
    const link = document.createElement('a');
    link.href = 'slides/' + encodeURIComponent(item.dir) + '/';
    link.textContent = item.title;
    title.append(link);
    const description = document.createElement('p');
    description.className = 'card-desc';
    description.textContent = item.description || '';
    const stage = document.createElement('p');
    stage.className = 'card-stage';
    stage.textContent = item.stage || '발표 자료';
    const audience = document.createElement('p');
    audience.className = 'card-audience';
    audience.textContent = '준비 · ' + item.prerequisites;
    const open = document.createElement('span');
    open.className = 'card-open';
    open.setAttribute('aria-hidden', 'true');
    open.innerHTML = '발표 열어보기 <span>↗</span>';
    card.append(top, icon, stage, title, description, audience, open);
    return card;
  }

  fetch('slides.json', { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) throw new Error('목록 요청 실패');
      return response.json();
    })
    .then(list => {
      if (!Array.isArray(list)) throw new Error('목록 형식 오류');
      const valid = list.filter(item => item && typeof item.title === 'string' && item.title.trim() &&
        typeof item.dir === 'string' && /^[a-z0-9-]+$/.test(item.dir) && /^\d{4}-\d{2}-\d{2}$/.test(item.date || '') &&
        /^(N[1-9]\d*|E\d+)$/.test(item.module || '') && ['novice', 'expert'].includes(item.track) && typeof item.prerequisites === 'string');
      if (!valid.length) throw new Error('사용 가능한 과정 목록 없음');
      // The static cards also serve file://, no-JS and failed-fetch readers.
      const novice = valid.filter(item => item.track === 'novice');
      const expert = valid.filter(item => item.track === 'expert');
      grid.replaceChildren(...novice.map(buildCard));
      expertGrid.replaceChildren(...expert.map(buildCard));
      count.textContent = valid.length + '개 모듈 · 두 가지 과정';
      status.hidden = true;
    })
    .catch(() => {
      status.replaceChildren(document.createTextNode('최신 목록을 불러오지 못해 저장된 과정 목록을 표시합니다. '));
      const retry = document.createElement('button');
      retry.className = 'retry-button';
      retry.type = 'button';
      retry.textContent = '다시 불러오기';
      retry.addEventListener('click', () => location.reload());
      const fallback = document.createElement('a');
      fallback.href = 'slides/llm-agent-basics/';
      fallback.textContent = '첫 학습 자료 열기 ↗';
      status.append(retry, document.createTextNode(' '), fallback);
      status.hidden = false;
    });
})();
