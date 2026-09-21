/* The archive is an ordinary list; its links do not depend on Galaxy rendering. */
(() => {
  'use strict';
  const grid = document.getElementById('cards');
  const status = document.getElementById('status');
  const count = document.getElementById('log-count');
  const tones = ['var(--lime)', 'var(--lavender)', 'var(--peach)', 'var(--green)'];
  const symbols = ['↗', '✳', '⌘', '↔', '◇', '↗'];

  function buildCard(item, number, order) {
    const card = document.createElement('li');
    card.className = 'card';
    card.style.setProperty('--card-tone', tones[order % tones.length]);
    const top = document.createElement('div');
    top.className = 'card-top';
    const index = document.createElement('span');
    index.className = 'card-index';
    index.textContent = 'LOG ' + String(number).padStart(2, '0');
    const date = document.createElement('time');
    date.dateTime = item.date;
    date.textContent = item.date.replaceAll('-', '.');
    top.append(index, date);
    if (order === 0) {
      const badge = document.createElement('span');
      badge.className = 'card-badge';
      badge.textContent = 'NEW';
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
    const open = document.createElement('span');
    open.className = 'card-open';
    open.setAttribute('aria-hidden', 'true');
    open.innerHTML = '발표 열어보기 <span>↗</span>';
    card.append(top, icon, title, description, open);
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
      const chronological = valid.slice().sort((a, b) => a.date.localeCompare(b.date));
      chronological.slice().reverse().forEach((item, index) => grid.append(buildCard(item, valid.length - index, index)));
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
      fallback.href = 'slides/agent-tools-antigravity/';
      fallback.textContent = '최근 발표 바로 열기 ↗';
      status.append(retry, document.createTextNode(' '), fallback);
      status.hidden = false;
    });
})();
