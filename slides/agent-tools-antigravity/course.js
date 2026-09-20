(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slides > section')];
  const params = new URLSearchParams(location.search);
  const narrowScreen = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const printView = params.get('view') === 'print' || params.has('print-pdf');
  const readView = printView || params.get('view') === 'read' || narrowScreen.matches || typeof Reveal === 'undefined';
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
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, '').split('/')[0]);
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
    byId('previous').disabled = activeIndex === 0;
    byId('next').disabled = activeIndex === slides.length - 1;
    byId('progress-fill').style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    document.title = `${activeIndex + 1}. ${slide.dataset.title} — AI, 한 걸음 더`;
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

  byId('previous').addEventListener('click', () => goTo(activeIndex - 1));
  byId('next').addEventListener('click', () => goTo(activeIndex + 1));
  byId('contents-open').addEventListener('click', () => {
    byId('contents-dialog').showModal();
    byId('contents-list').querySelector('[aria-current="step"]')?.scrollIntoView({ block: 'nearest' });
  });
  byId('notes-open').addEventListener('click', () => {
    byId('notes-title').textContent = `${String(activeIndex + 1).padStart(2, '0')} · 진행 메모`;
    byId('notes-content').replaceChildren(...[...slides[activeIndex].querySelector('.notes').children].map(node => node.cloneNode(true)));
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

  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = byId(button.dataset.copy);
      const text = target.innerText;
      try {
        if (location.protocol === 'file:' || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        notify('복사했어요. Antigravity 대화창에 붙여넣으세요.');
      } catch {
        // Direct file access or a browser policy may block clipboard writes.
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify('문장을 선택했어요. Ctrl+C 또는 Command+C로 복사하세요.');
      }
    });
  });

  const zoneDescriptions = {
    files: '① 자료 — AI가 작업할 폴더와 파일을 살펴보는 곳',
    chat: '② 대화 — 원하는 일을 평소 말로 부탁하는 곳',
    result: '③ 결과 — 계획과 완성된 파일을 확인하는 곳'
  };
  document.querySelectorAll('[data-zone]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-zone]').forEach(other => {
        const selected = other === button;
        other.classList.toggle('selected', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      byId('zone-explanation').textContent = zoneDescriptions[button.dataset.zone];
    });
  });
  byId('approve-demo').addEventListener('click', () => {
    byId('approve-feedback').textContent = '연습 완료! 실제 앱에서는 Proceed를 누르면 작업을 시작해요.';
    notify('버튼 연습입니다. 실제 AI 작업은 실행되지 않았어요.');
  });
  byId('refine-demo').addEventListener('click', () => {
    const refined = byId('refine-preview').classList.toggle('is-refined');
    byId('refine-demo').setAttribute('aria-pressed', String(refined));
    byId('refine-demo').textContent = refined ? '수정 전으로 돌아가기 ↶' : '바뀐 모습 보기 →';
    byId('refine-label').textContent = refined ? '수정 후 · 제목을 두 배로' : '수정 전 · 학습용 예시';
  });
  document.querySelectorAll('.verify-card').forEach(button => {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      const count = document.querySelectorAll('.verify-card[aria-pressed="true"]').length;
      byId('verification-status').innerHTML = `${count === 3 ? '좋아요. 실제 결과물도 같은 기준으로 확인하세요.' : '확인한 항목을 눌러 보세요.'} <strong>${count} / 3</strong>`;
    });
  });
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-answer]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      byId('quiz-feedback').textContent = button.dataset.answer === 'b'
        ? '맞아요! 만들 파일과 내가 확인할 방법을 함께 부탁했어요.'
        : 'A는 방법을 묻는 말이에요. 파일을 만들어 달라는 부탁도 찾아보세요.';
    });
  });

  byId('print-course').addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.set('view', 'print');
    url.hash = '';
    location.assign(url.href);
  });

  let restoreReading = false;
  const localPrintLinks = [...document.querySelectorAll('.slides a[href]')]
    .filter(link => !/^https?:/.test(link.getAttribute('href')))
    .map(link => ({ link, href: link.getAttribute('href') }));
  window.addEventListener('beforeprint', () => {
    restoreReading = document.body.classList.contains('reading');
    document.body.classList.remove('reading');
    document.body.classList.add('printing');
    // Local web controls cannot act as portable PDF links. Official links remain.
    localPrintLinks.forEach(({ link }) => link.removeAttribute('href'));
    document.querySelectorAll('.slides > section').forEach(slide => {
      slide.style.visibility = 'visible';
    });
  });
  window.addEventListener('afterprint', () => {
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
          width: 1280,
          height: 720,
          margin: 0.025,
          minScale: 0.2,
          maxScale: 1.4,
          hash: true,
          history: false,
          controls: false,
          progress: false,
          center: false,
          overview: false,
          transition: reducedMotion.matches ? 'none' : 'fade',
          transitionSpeed: 'fast',
          backgroundTransition: 'none',
          autoSlide: 0,
          view: 'slide',
          scrollActivationWidth: null,
          pdfSeparateFragments: false,
          keyboardCondition: event => !document.querySelector('dialog[open]') &&
            !event.target.closest('input, textarea, select, [contenteditable]') &&
            !(event.target.closest('button, a') && ['Enter', ' ', 'Spacebar'].includes(event.key))
        });
        ready = true;
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
    if (!readView && ready) Reveal.configure({ transition: event.matches ? 'none' : 'fade' });
  });
  initialize();
})();
