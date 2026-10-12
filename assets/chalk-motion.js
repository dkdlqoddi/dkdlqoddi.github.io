/* Finite component writing; content and Reveal's own transitions stay intact. */
(() => {
  'use strict';
  if (!document.documentElement.classList.contains('chalk-theme')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const isDeck = !!document.querySelector('.reveal');
  const marker = '[data-chalk], [data-chalk-group], [data-chalk-stroke]';
  let animations = [], activeBoard = null, paused = false, completed = false, revision = 0;
  const suspended = new Set(), writing = new Set();
  const cursor = document.createElement('i');
  cursor.className = 'chalk-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.hidden = true;
  const controls = document.createElement('div');
  controls.className = 'chalk-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', '판서 애니메이션');
  controls.innerHTML = '<button type="button" data-chalk-replay>판서 다시</button><button type="button" data-chalk-pause aria-pressed="false">잠시 멈춤</button><button type="button" data-chalk-finish>완성 보기</button>';
  document.querySelector('.top-actions')?.prepend(controls);
  const pause = controls.querySelector('[data-chalk-pause]');
  function stopped() { return reduce.matches || document.body.classList.contains('reading') || document.body.classList.contains('printing') || matchMedia('print').matches; }
  function sync() {
    pause.textContent = paused ? '이어서 쓰기' : '잠시 멈춤';
    pause.setAttribute('aria-pressed', String(paused));
    pause.disabled = !animations.some(a => ['running', 'paused', 'pending'].includes(a.playState));
  }
  function finish() {
    revision++;
    completed = true;
    animations.forEach(a => a.cancel());
    animations = [];
    suspended.clear();
    writing.forEach(el => el.classList.remove('chalk-writing'));
    writing.clear();
    cursor.hidden = true;
    paused = false;
    sync();
  }
  function register(el, frames, timing) {
    el.classList.add('chalk-step', 'chalk-writing');
    writing.add(el);
    const animation = el.animate(frames, { fill: 'backwards', easing: 'ease-out', ...timing });
    animations.push(animation);
    animation.finished.then(() => {
      el.classList.remove('chalk-writing'); writing.delete(el); sync();
    }).catch(() => {});
    if (paused || document.hidden) {
      if (document.hidden) suspended.add(animation);
      animation.pause();
    }
    return animation;
  }
  function stepsFor(board) {
    const steps = [];
    function visit(el) {
      // Do not touch notes, hidden controls, fragment visibility or morphing diagrams.
      if (el.matches('aside,script,style,defs,title,desc,caption,br,.visually-hidden,.chalk-cursor,.board-source,.footnote,.print-only') ||
          el.closest('.fragment,[hidden],[aria-live]') || el.contains(document.activeElement) ||
          (el.closest('[data-auto-animate]') && (el.closest('svg') || el.matches('[data-id]')))) return;
      if (!el.getBoundingClientRect().height) return;
      if (el.matches('button,a,input,textarea,select')) {
        steps.push({ el, kind: 'fade' }); return;
      }
      if (el.hasAttribute('data-chalk-stroke') && typeof el.getTotalLength === 'function') {
        steps.push({ el, kind: 'stroke' }); return;
      }
      const group = el.hasAttribute('data-chalk-group');
      const descendants = el.querySelector(marker + ', .fragment');
      if (group || descendants) {
        // Only short opacity on frames; never clip a parent over its child animations.
        if (group && el.dataset.chalkGroup !== 'sequence' && !el.querySelector('.fragment')) steps.push({ el, kind: 'frame' });
        [...el.children].forEach(visit);
      } else {
        steps.push({ el, kind: el.dataset.chalk === 'fade' || el.matches('svg,g,img,tr') ? 'fade' : 'write' });
      }
    }
    [...board.children].forEach(visit);
    return steps;
  }
  function animateBoard(board, offset = 0) {
    if (!board || stopped()) return;
    const steps = stepsFor(board);
    // More components do not add a long wait: headings lead, details overlap gently.
    const stride = Math.min(150, 3200 / Math.max(1, steps.length));
    let delay = offset + 60, titleTiming;
    for (const { el, kind } of steps) {
      const heading = el.matches('h1,h2');
      const duration = heading ? 620 : kind === 'frame' ? 260 : kind === 'stroke' ? 430 : 460;
      if (heading) titleTiming = { el, delay, duration };
      let frames;
      const opacity = Number(getComputedStyle(el).opacity);
      if (kind === 'stroke') {
        const length = el.getTotalLength();
        frames = [{ strokeDasharray: `${length}`, strokeDashoffset: length }, { strokeDasharray: `${length}`, strokeDashoffset: 0 }];
      } else if (kind === 'frame' || kind === 'fade') {
        frames = [{ opacity: 0 }, { opacity }];
      } else {
        frames = [{ clipPath: 'inset(0 100% 0 0)', opacity: opacity * .35 }, { clipPath: 'inset(0 0% 0 0)', opacity }];
      }
      register(el, frames, { duration, delay });
      delay += heading ? 500 : stride;
    }
    if (titleTiming && isDeck) {
      const { el: title, ...timing } = titleTiming;
      board.append(cursor); cursor.hidden = false;
      const boardRect = board.getBoundingClientRect(), titleRect = title.getBoundingClientRect();
      const scale = boardRect.width / board.offsetWidth;
      const start = (titleRect.left - boardRect.left) / scale + 4;
      const end = Math.min(start + titleRect.width / scale - 20, board.clientWidth - 45);
      cursor.style.top = `${(titleRect.bottom - boardRect.top) / scale - 10}px`;
      register(cursor, [{ left: `${start}px`, opacity: 0 }, { left: `${start}px`, opacity: 1, offset: .03 }, { left: `${end}px`, opacity: 1, offset: .97 }, { left: `${end}px`, opacity: 0 }], { ...timing, fill: 'both', easing: 'linear' });
    }
    sync();
  }
  function visibleCards() {
    return [...document.querySelectorAll('#cards .card')].filter(card => {
      const rect = card.getBoundingClientRect();
      return rect.top < innerHeight && rect.bottom > 0;
    });
  }
  function write(board) {
    finish(); activeBoard = board; completed = false;
    const run = revision;
    // Embedded Korean font metrics must settle before layout and cursor measurement.
    document.fonts.ready.then(() => {
      if (run !== revision || stopped()) return;
      if (isDeck) Reveal.layout();
      animateBoard(board);
      if (!isDeck) visibleCards().forEach((card, i) => animateBoard(card, i * 120));
    });
  }
  controls.querySelector('[data-chalk-replay]').addEventListener('click', () => write(activeBoard));
  controls.querySelector('[data-chalk-finish]').addEventListener('click', finish);
  pause.addEventListener('click', () => {
    paused = !paused;
    animations.filter(a => a.playState !== 'finished' && a.playState !== 'idle').forEach(a => {
      if (paused || document.hidden) a.pause(); else a.play();
    });
    sync();
  });
  document.addEventListener('focusin', event => { if (activeBoard?.contains(event.target)) finish(); });
  document.addEventListener('pointerdown', event => {
    if (activeBoard?.contains(event.target) && event.target.closest('button,a,input,textarea,select')) finish();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      animations.filter(a => a.playState === 'running').forEach(a => { suspended.add(a); a.pause(); });
    } else {
      if (!paused) suspended.forEach(a => { if (a.playState === 'paused') a.play(); });
      suspended.clear();
    }
  });
  window.addEventListener('beforeprint', finish);
  reduce.addEventListener('change', finish);
  if (isDeck && window.Reveal) {
    const begin = () => write(Reveal.getCurrentSlide());
    Reveal.on('ready', begin);
    Reveal.on('slidechanged', event => write(event.currentSlide));
    if (Reveal.isReady()) begin();
  } else if (!isDeck) {
    const hero = document.querySelector('.hero');
    if (hero) write(hero);
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target); observer.unobserve(entry.target);
        if (!stopped() && !completed && !entry.target.getAnimations({ subtree: true }).length) animateBoard(entry.target, i * 100);
      });
    }, { threshold: .15 });
    const cards = document.querySelector('#cards');
    const watch = () => cards?.querySelectorAll('.card').forEach(card => { if (!seen.has(card)) observer.observe(card); });
    if (cards) new MutationObserver(watch).observe(cards, { childList: true });
    watch();
  }
  window.ChalkMotion = { finish, replay: () => write(activeBoard) };
})();
