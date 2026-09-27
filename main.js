/* The archive is an ordinary list; its links do not depend on Galaxy rendering. */
(() => {
  'use strict';
  const grid = document.getElementById('cards');
  const status = document.getElementById('status');
  const count = document.getElementById('log-count');
  const tones = ['var(--lime)', 'var(--lavender)', 'var(--peach)', 'var(--green)'];
  const symbols = ['↗', '✳', '⌘', '↔', '◇', '↗'];

  function buildCard(item, order) {
    const card = document.createElement('li');
    card.className = 'card';
    card.style.setProperty('--card-tone', tones[order % tones.length]);
    const top = document.createElement('div');
    top.className = 'card-top';
    const index = document.createElement('span');
    index.className = 'card-index';
    index.textContent = 'STEP ' + String(order + 1).padStart(2, '0');
    const date = document.createElement('time');
    date.dateTime = item.date;
    date.textContent = item.date.replaceAll('-', '.');
    top.append(index, date);
    if (order === 0) {
      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = '시작';
      top.append(badge);
    }
    const icon = document.createElement('span');
    icon.className = 'card-icon';
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
    audience.textContent = item.audience ? '대상 · ' + item.audience : '';
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
        typeof item.dir === 'string' && /^[a-z0-9-]+$/.test(item.dir) && /^\d{4}-\d{2}-\d{2}$/.test(item.date || ''));
      // The manifest records prerequisite order; dates remain publication metadata.
      valid.forEach((item, index) => grid.append(buildCard(item, index)));
      count.textContent = valid.length + '개의 이야기';
      status.hidden = valid.length > 0;
      status.textContent = valid.length ? '' : '아직 기록된 발표가 없습니다.';
    })
    .catch(() => {
      status.replaceChildren(document.createTextNode('발표 목록을 불러오지 못했습니다. '));
      const retry = document.createElement('button');
      retry.className = 'retry-button';
      retry.type = 'button';
      retry.textContent = '다시 불러오기';
      retry.addEventListener('click', () => location.reload());
      const fallback = document.createElement('a');
      fallback.href = 'slides/notebooklm-examples/';
      fallback.textContent = '첫 학습 자료 열기 ↗';
      status.append(retry, document.createTextNode(' '), fallback);
      status.hidden = false;
    });
})();
