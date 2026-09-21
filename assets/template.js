/* One header template for the archive, presentations and error page. */
(() => {
  'use strict';
  const home = new URL('../', document.currentScript.src).href;

  function mountHeader({ label = '함께 나눈 생각을 모으는 곳', actions = '' } = {}) {
    if (document.querySelector('.topbar')) return;
    const header = document.createElement('header');
    header.className = 'topbar';
    header.innerHTML = '<a class="brand"><span class="brand-symbol" aria-hidden="true">↗</span> 발표 기록</a><span class="course-label"></span><nav class="top-actions" aria-label="페이지 메뉴"></nav>';
    header.querySelector('.brand').href = home;
    header.querySelector('.course-label').textContent = label;
    header.querySelector('.top-actions').innerHTML = actions;
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = document.querySelector('#course') ? '#course' : '#main';
    skip.textContent = '본문으로 건너뛰기';
    const main = document.querySelector('main');
    if (main) main.tabIndex = -1;
    document.body.prepend(skip, header);
  }

  window.SiteTemplate = { mountHeader, home };
  if (document.body.dataset.template === 'site') {
    mountHeader({ actions: '<a class="archive-link" href="' + home + '#log">발표 모음 <span aria-hidden="true">↗</span></a>' });
  }
})();
