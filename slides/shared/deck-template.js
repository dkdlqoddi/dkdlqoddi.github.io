(() => {
  'use strict';

  const legacy = document.body.classList.contains('legacy-deck');
  const deckTitle = document.title.split(' — ')[0];
  SiteTemplate.mountHeader({ label: deckTitle, actions: '<button id="view-toggle" type="button">읽기 화면</button><button id="contents-open" type="button"><span aria-hidden="true">☷</span> 목차</button>' });
  document.body.insertAdjacentHTML('beforeend', `
  <footer class="course-nav" aria-label="슬라이드 이동">
    <div class="nav-context"><span id="chapter-name"></span><button id="template-print" type="button" class="template-print">인쇄</button><button id="notes-open" type="button">진행 메모</button></div>
    <div class="nav-center"><button id="previous" class="nav-button" type="button" aria-label="이전 장">← <span>이전</span></button><span id="slide-counter" aria-live="polite" aria-atomic="true">01</span><button id="next" class="nav-button next" type="button"><span>다음</span> →</button></div>
    <button id="fullscreen" type="button" aria-label="전체 화면으로 보기">전체 화면 <span aria-hidden="true">⛶</span></button>
    <div class="course-progress" aria-hidden="true"><span id="progress-fill"></span></div>
  </footer>

  <dialog id="contents-dialog" aria-labelledby="contents-title"><div class="dialog-heading"><h2 id="contents-title">어디부터 볼까요?</h2><button type="button" data-close-dialog aria-label="목차 닫기">닫기 ×</button></div><nav id="contents-list" aria-label="수업 목차"></nav></dialog>
  <dialog id="notes-dialog" aria-labelledby="notes-title"><div class="dialog-heading"><h2 id="notes-title">진행 메모</h2><button type="button" data-close-dialog aria-label="진행 메모 닫기">닫기 ×</button></div><div id="notes-content"></div></dialog>
  <div id="notification" class="notification" role="status" aria-live="polite"></div>
  `);
  const slides = [...document.querySelectorAll('.slides > section')];
  slides.forEach((slide, index) => {
    if (!slide.id) slide.id = 'slide-' + (index + 1);
    if (!slide.dataset.title) slide.dataset.title = slide.querySelector('h1, h2, h3, h4')?.innerText.replace(/\s+/g, ' ').trim() || `${index + 1}장`;
    if (!slide.dataset.chapter) slide.dataset.chapter = deckTitle;
    slide.dataset.pageLabel = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
  });
  const params = new URLSearchParams(location.search);
  const narrowScreen = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const printView = params.get('view') === 'print' || params.has('print-pdf');
  const readView = printView || params.get('view') === 'read' || (narrowScreen.matches && params.get('view') !== 'slides') || typeof Reveal === 'undefined';
  if (legacy && readView) {
    document.querySelectorAll('.reveal svg[role="img"], .reveal svg.diag, .reveal svg.mini-diag, .reveal svg.svg-diagram').forEach(svg => {
      const wrapper = document.createElement('div');
      wrapper.className = 'diagram-scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', (svg.getAttribute('aria-label') || '발표 도표') + ' · 가로로 스크롤할 수 있습니다');
      svg.before(wrapper);
      wrapper.append(svg);
    });
  }
  const byId = id => document.getElementById(id);
  let activeIndex = 0;
  let notificationTimer;
  let observer;
  let scrollingToSlide = false;
  let scrollTimer;
  let ready = false;

  // Icons supplement visible labels; they do not add duplicate spoken content.
  document.querySelectorAll('svg.icon').forEach(icon => {
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
  });

  const hashIndex = () => {
    let hash;
    try { hash = decodeURIComponent(location.hash.replace(/^#\/?/, '').split('/')[0]); } catch { return 0; }
    const named = slides.findIndex(slide => slide.id === hash);
    if (named >= 0) return named;
    const number = Number(hash);
    return Number.isInteger(number) && number >= 0 && number < slides.length ? number : 0;
  };

  function setHash(index) {
    const hash = '#/' + slides[index].id;
    if (location.hash !== hash) {
      try { history.replaceState(null, '', hash); }
      catch { location.hash = hash; }
    }
  }

  function updateNavigation(index) {
    activeIndex = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[activeIndex];
    byId('slide-counter').innerHTML = `${String(activeIndex + 1).padStart(2, '0')} <span>/ ${slides.length}</span>`;
    byId('chapter-name').textContent = slide.dataset.chapter;
    byId('previous').disabled = activeIndex === 0 && (readView || !ready || !Reveal.availableFragments().prev);
    byId('next').disabled = activeIndex === slides.length - 1 && (readView || !ready || !Reveal.availableFragments().next);
    byId('progress-fill').style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    document.title = `${activeIndex + 1}. ${slide.dataset.title} — ${deckTitle}`;
    byId('notes-open').hidden = !slide.querySelector('.notes');
    document.querySelectorAll('#contents-list button').forEach((button, i) => {
      if (i === activeIndex) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    if (readView && ready) setHash(activeIndex);
  }

  function goTo(index) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (readView) {
      scrollingToSlide = true;
      clearTimeout(scrollTimer);
      updateNavigation(index);
      slides[index].scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      scrollTimer = setTimeout(() => { scrollingToSlide = false; }, 900);
    } else if (ready) Reveal.slide(index);
  }

  function notify(message) {
    clearTimeout(notificationTimer);
    const notification = byId('notification');
    notification.textContent = message;
    notification.classList.add('is-visible');
    notificationTimer = setTimeout(() => notification.classList.remove('is-visible'), 4000);
  }

  slides.forEach((slide, index) => {
    slide.dataset.page = String(index + 1).padStart(2, '0');
    slide.setAttribute('aria-label', `${index + 1}장. ${slide.dataset.title}`);
    const button = document.createElement('button');
    button.type = 'button';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, document.createTextNode(slide.dataset.title));
    button.addEventListener('click', () => {
      byId('contents-dialog').close();
      goTo(index);
    });
    byId('contents-list').append(button);
  });

  byId('previous').addEventListener('click', () => readView ? goTo(activeIndex - 1) : Reveal.prev());
  byId('next').addEventListener('click', () => readView ? goTo(activeIndex + 1) : Reveal.next());
  byId('contents-open').addEventListener('click', () => {
    byId('contents-dialog').showModal();
    byId('contents-list').querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest' });
  });
  byId('notes-open').addEventListener('click', () => {
    byId('notes-title').textContent = `${String(activeIndex + 1).padStart(2, '0')} · 진행 메모`;
    byId('notes-content').replaceChildren(...[...(slides[activeIndex].querySelector('.notes') || document.createElement('div')).children].map(node => node.cloneNode(true)));
    byId('notes-dialog').showModal();
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  byId('view-toggle').textContent = readView ? '발표 화면' : '읽기 화면';
  byId('view-toggle').addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.delete('print-pdf');
    url.searchParams.set('view', readView ? 'slides' : 'read');
    url.hash = '/' + slides[activeIndex].id;
    location.assign(url.href);
  });

  byId('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else notify('이 브라우저에서는 전체 화면을 지원하지 않아요.');
    } catch { notify('브라우저의 전체 화면 메뉴를 이용해 주세요.'); }
  });
  document.addEventListener('fullscreenchange', () => {
    const full = Boolean(document.fullscreenElement);
    byId('fullscreen').textContent = full ? '전체 화면 닫기 ⛶' : '전체 화면 ⛶';
    byId('fullscreen').setAttribute('aria-label', full ? '전체 화면 닫기' : '전체 화면으로 보기');
  });

  document.querySelectorAll('a[href^="#/"]').forEach(link => {
    link.addEventListener('click', event => {
      const index = slides.findIndex(slide => '#/' + slide.id === link.getAttribute('href'));
      if (index !== -1) { event.preventDefault(); goTo(index); }
    });
  });

  function printCourse() {
    const url = new URL(location.href);
    url.searchParams.set('view', 'print');
    url.hash = '';
    location.assign(url.href);
  }
  byId('print-course')?.addEventListener('click', printCourse);
  byId('template-print').addEventListener('click', printCourse);

  let restoreReading = false;
  let printFrames = [];
  const localPrintLinks = [...document.querySelectorAll('.slides a[href]')]
    .filter(link => !/^https?:/.test(link.getAttribute('href')))
    .map(link => ({ link, href: link.getAttribute('href') }));
  window.addEventListener('beforeprint', () => {
    restoreReading = document.body.classList.contains('reading');
    document.body.classList.remove('reading');
    document.body.classList.add('printing');
    // Local web controls cannot act as portable PDF links. Official links remain.
    localPrintLinks.forEach(({ link }) => link.removeAttribute('href'));
    slides.forEach(slide => { slide.style.visibility = 'visible'; });
    if (legacy && !printFrames.length) {
      printFrames = slides.map(slide => {
        const frame = document.createElement('div');
        frame.className = 'print-content';
        frame.append(...slide.childNodes);
        slide.append(frame);
        return { slide, frame };
      });
      printFrames.forEach(({ slide, frame }) => {
        const before = getComputedStyle(slide, '::before');
        const decoration = before.content === 'none' ? 0 :
          (parseFloat(before.height) || 0) + (parseFloat(before.marginTop) || 0) + (parseFloat(before.marginBottom) || 0);
        const scale = Math.min(1, (650 - decoration) / frame.scrollHeight, 924 / frame.scrollWidth);
        frame.style.setProperty('--print-scale', String(scale));
      });
    }
  });
  window.addEventListener('afterprint', () => {
    printFrames.forEach(({ frame }) => frame.replaceWith(...frame.childNodes));
    printFrames = [];
    document.body.classList.toggle('reading', restoreReading);
    document.body.classList.remove('printing');
    localPrintLinks.forEach(({ link, href }) => link.setAttribute('href', href));
    slides.forEach(slide => slide.style.removeProperty('visibility'));
    if (!readView && ready) Reveal.layout();
  });

  async function initialize() {
    const initialIndex = hashIndex();
    if (readView) {
      document.body.classList.add('reading');
      // The top quarter of the reading window determines the current section.
      observer = new IntersectionObserver(entries => {
        if (scrollingToSlide) return;
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length) updateNavigation(slides.indexOf(visible[0].target));
      }, { rootMargin: '-75px 0px -65% 0px', threshold: 0 });
      slides.forEach(slide => observer.observe(slide));
      ready = true;
      await document.fonts.ready;
      goTo(initialIndex);
      window.addEventListener('hashchange', () => goTo(hashIndex()));
    } else {
      document.body.classList.remove('reading');
      try {
        await Reveal.initialize({
          width: legacy ? 960 : 1280,
          height: legacy ? 700 : 720,
          margin: 0.025,
          minScale: 0.2,
          maxScale: 1.4,
          hash: true,
          history: false,
          controls: false,
          progress: false,
          center: legacy,
          overview: false,
          transition: reducedMotion.matches ? 'none' : 'fade',
          transitionSpeed: 'fast',
          backgroundTransition: 'none',
          autoSlide: 0,
          view: 'slide',
          scrollActivationWidth: null,
          pdfSeparateFragments: false,
          autoAnimateDuration: reducedMotion.matches ? 0 : 0.6,
          keyboardCondition: event => !document.querySelector('dialog[open]') &&
            !event.target.closest('input, textarea, select, [contenteditable]') &&
            !(event.target.closest('button, a') && ['Enter', ' ', 'Spacebar'].includes(event.key))
        });
        ready = true;
        ['fragmentshown', 'fragmenthidden'].forEach(name => Reveal.on(name, () => updateNavigation(activeIndex)));
        Reveal.on('slidechanged', event => {
          updateNavigation(event.indexh);
          const focused = document.activeElement;
          if (focused?.closest('.slides > section') && !event.currentSlide.contains(focused)) focused.blur();
        });
        Reveal.slide(initialIndex);
        updateNavigation(initialIndex);
      } catch {
        const url = new URL(location.href);
        url.searchParams.set('view', 'read');
        location.replace(url.href);
      }
    }
    updateNavigation(initialIndex);
    if (printView) {
      await document.fonts.ready;
      requestAnimationFrame(() => window.print());
    }
  }

  // If zoom or rotation makes presentation text small, reflow into reading view.
  narrowScreen.addEventListener('change', event => {
    if (event.matches && !readView) {
      const url = new URL(location.href);
      url.searchParams.set('view', 'read');
      url.hash = '/' + slides[activeIndex].id;
      location.replace(url.href);
    }
  });
  reducedMotion.addEventListener('change', event => {
    if (!readView && ready) Reveal.configure({ transition: event.matches ? 'none' : 'fade', autoAnimateDuration: event.matches ? 0 : 0.6 });
  });
  window.DeckTemplate = { notify };
  initialize();
})();
