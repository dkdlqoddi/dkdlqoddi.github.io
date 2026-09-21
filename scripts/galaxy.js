/* Decorative CSS Galaxy. No WebGL, global input handlers or rendering loop. */
(() => {
  'use strict';
  const galaxy = document.getElementById('galaxy');
  const toggle = document.getElementById('motion-toggle');
  if (!galaxy || !toggle) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let visible = true;
  function update() {
    galaxy.classList.toggle('is-paused', paused || reducedMotion.matches || document.hidden || !visible);
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.innerHTML = paused ? '움직임 재생 <span aria-hidden="true">▷</span>' : '움직임 멈추기 <span aria-hidden="true">Ⅱ</span>';
  }
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); });
  observer.observe(galaxy);
  update();
})();
