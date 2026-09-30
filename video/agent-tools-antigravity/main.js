/* Builds the whole video timeline from the caption script, then either plays it
   in the browser (preview) or waits for the renderer to seek frame by frame. */
(() => {
  'use strict';
  const { add, sfx, tick, EASE } = window.VT;
  const FX = window.FX;
  const SCRIPT = window.VIDEO_SCRIPT;
  const SCENES = window.VIDEO_SCENES;
  const CARD = window.VIDEO_CARD;
  const params = new URLSearchParams(location.search);
  const RENDER = params.has('render');
  const FPS = 60;

  // Reading pace: captions stay up long enough for unhurried reading, while
  // every individual movement stays short.
  const READ = { cps: 5, base: 1200, min: 3000, max: 10000, gap: 320, lead: 1250, first: 1700, tail: 1100, card: 2800, outro: 4200 };
  const plain = text => text.replace(/\*\*/g, '');
  const letters = text => plain(text).replace(/\s/g, '').length;
  const captionLength = cap => {
    const text = typeof cap === 'string' ? cap : cap.t;
    const reading = READ.base + (letters(text) / READ.cps) * 1000;
    return Math.round(Math.min(READ.max, Math.max(READ.min, reading, cap.min || 0)));
  };

  // 1. Timing plan.
  const plan = [];
  let clock = 0;
  SCRIPT.scenes.forEach((sc, index) => {
    if (sc.card) {
      plan.push({ kind: 'card', card: sc.card, chapter: sc.chapter, index, t0: clock, t1: clock + READ.card });
      clock += READ.card;
    }
    const t0 = clock;
    let c = t0 + (index === 0 ? READ.first : READ.lead);
    const caps = sc.caps.map(cap => {
      const text = typeof cap === 'string' ? cap : cap.t;
      const item = { text, t0: c, t1: c + captionLength(cap) };
      c = item.t1 + READ.gap;
      return item;
    });
    const t1 = caps[caps.length - 1].t1 + READ.tail;
    plan.push({ kind: 'scene', sc, index, chapter: sc.chapter, t0, t1, caps });
    clock = t1;
  });
  const lastScene = plan[plan.length - 1];
  const TOTAL = clock + READ.outro;
  const scenesOnly = plan.filter(item => item.kind === 'scene');

  const stage = document.getElementById('stage');
  const root = document.getElementById('scenes');
  const cardsLayer = document.getElementById('cards');
  const wipes = document.getElementById('wipes');

  const markup = text => text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // 2. DOM for scenes and cards.
  plan.forEach(item => {
    const el = document.createElement('section');
    if (item.kind === 'scene') {
      const def = SCENES[item.sc.id];
      if (!def) throw new Error(`No scene definition for ${item.sc.id}`);
      el.className = 'scene';
      el.id = `sc-${item.sc.id}`;
      el.innerHTML = def.html;
      root.appendChild(el);
    } else {
      el.className = 'chapter-card';
      el.id = `card-${item.card.num}`;
      el.innerHTML = CARD.html(item.card);
      cardsLayer.appendChild(el);
    }
    el.hidden = true;
    item.el = el;
    el.querySelectorAll('.head').forEach(FX.splitWords);
  });

  // Visibility windows: scenes swap under a full wipe; cards slide over them.
  plan.forEach((item, i) => {
    const prev = plan[i - 1];
    const next = plan[i + 1];
    let from = item.t0;
    let to = item.t1;
    if (item.kind === 'card') from = item.t0 - 470;
    if (item.kind === 'scene' && prev && prev.kind === 'card') from = item.t0 - 460;
    if (item.kind === 'scene' && next && next.kind === 'card') to = item.t1;
    if (item === lastScene) to = TOTAL + 1;
    item.from = from;
    item.to = to;
    window.VT.scene(item.el, from, to);
  });

  const context = item => {
    const el = item.el;
    const prev = plan[plan.indexOf(item) - 1];
    const enter = item.index === 0 && item.kind === 'scene' ? 420 : prev && prev.kind === 'card' ? item.t0 - 180 : item.t0 + 170;
    return {
      el, id: item.sc ? item.sc.id : el.id, t0: item.t0, t1: item.t1, in: enter,
      b: item.caps ? item.caps.map(c => c.t0) : [], e: item.caps ? item.caps.map(c => c.t1) : [],
      q: sel => el.querySelector(sel), qa: sel => el.querySelectorAll(sel)
    };
  };

  // 3. Global chrome: chapter pill, counter, progress. The paper background stays
  // still on purpose: drifting dots and gradients shimmer or band after encoding.
  const chrome = () => {
    const slot = document.querySelector('.chapter-slot');
    const segments = [];
    plan.forEach(item => {
      const label = item.chapter;
      const start = item.kind === 'card' ? item.t1 - 250 : item.t0 + (item.index === 0 ? 300 : 120);
      const last = segments[segments.length - 1];
      if (!last || last.label !== label) segments.push({ label, start });
    });
    segments.forEach((seg, i) => {
      const pill = document.createElement('span');
      pill.className = 'chapter-pill';
      pill.textContent = seg.label;
      slot.appendChild(pill);
      add(pill, [{ opacity: 0, transform: 'rotateX(90deg)' }, { opacity: 1, transform: 'none' }], { at: seg.start, dur: 420, ease: EASE.spring });
      const next = segments[i + 1];
      if (next) add(pill, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'rotateX(-90deg)' }], { at: next.start - 220, dur: 220, ease: EASE.in });
    });
    // Counter follows the scene on screen; a card announces the next scene.
    const counter = document.querySelector('.counter');
    const total = scenesOnly.length;
    const pad = n => String(n).padStart(2, '0');
    let shown = '';
    const changes = scenesOnly.map((item, i) => {
      const prev = plan[plan.indexOf(item) - 1];
      return { at: prev && prev.kind === 'card' ? prev.t1 - 250 : item.t0 + (i === 0 ? 300 : 120), n: i + 1 };
    });
    tick(t => {
      let n = 1;
      for (const change of changes) if (t >= change.at) n = change.n;
      const text = `<b>${pad(n)}</b> / ${total}`;
      if (text !== shown) { counter.innerHTML = text; shown = text; }
    });
    changes.slice(1).forEach(change => FX.pulse(counter, change.at, { scale: 1.18, dur: 380 }));
    add(document.querySelector('.vbar'), [{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'none' }], { at: 150, dur: 500, ease: EASE.out });
    const fill = document.querySelector('.progress i');
    add(fill, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at: 0, dur: TOTAL, ease: EASE.linear });
    const bar = document.querySelector('.progress');
    plan.filter(item => item.kind === 'card').forEach(item => {
      const mark = document.createElement('span');
      mark.className = 'tick';
      mark.style.left = `${(item.t0 / TOTAL) * 100}%`;
      bar.appendChild(mark);
    });
  };

  // 4. Captions.
  const captions = () => {
    const holder = document.querySelector('.captions');
    const box = holder.querySelector('.cap-box');
    scenesOnly.forEach(item => {
      const first = item.caps[0];
      const last = item.caps[item.caps.length - 1];
      add(box, [{ opacity: 0, transform: 'translateY(26px) scale(.97)' }, { opacity: 1, transform: 'none' }], { at: first.t0 - 260, dur: 380, ease: EASE.spring });
      add(box, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(18px)' }], { at: last.t1 + 60, dur: 260, ease: EASE.in });
      item.caps.forEach(cap => {
        const line = document.createElement('p');
        line.className = 'cap';
        line.innerHTML = `<span>${markup(cap.text)}</span>`;
        holder.appendChild(line);
        add(line, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { at: cap.t0, dur: 300, ease: EASE.out });
        add(line, [{ opacity: 1 }, { opacity: 0 }], { at: cap.t1 - 140, dur: 180, ease: EASE.in });
      });
    });
  };

  // 5. Transitions between scenes: paper bands or pastel rings, alternating.
  const bands = (B, n) => {
    const colors = ['b1', 'b2', 'b3', 'b4', 'b1'];
    colors.forEach((cls, k) => {
      const band = document.createElement('div');
      band.className = `band ${cls}`;
      band.style.left = `${-300 + k * 320}px`;
      band.style.zIndex = String(10 - k);
      wipes.appendChild(band);
      add(band, [{ transform: 'translateX(-1900px)' }, { transform: 'translateX(0)' }], { at: B - 440 + k * 22, dur: 380 - k * 22, ease: EASE.inOut, fill: 'both' });
      add(band, [{ transform: 'translateX(0)' }, { transform: 'translateX(1900px)' }], { at: B + 60, dur: 380 - (4 - k) * 22, ease: EASE.inOut, fill: 'forwards' });
    });
    sfx('whoosh', B - 440, 0.55, -0.4 + (n % 2) * 0.1);
  };

  const iris = (B, from, to) => {
    ['i1', 'i2', 'i3'].forEach((cls, k) => {
      const ring = document.createElement('div');
      ring.className = `iris ${cls}`;
      ring.style.zIndex = String(k + 1);
      wipes.appendChild(ring);
      add(ring, [{ translate: `${from.x}px ${from.y}px`, scale: '0' }, { translate: `${from.x}px ${from.y}px`, scale: '17' }], { at: B - 440 + k * 70, dur: 400 - k * 70, ease: EASE.in, fill: 'both' });
      add(ring, [{ translate: `${to.x}px ${to.y}px`, scale: '17' }, { translate: `${to.x}px ${to.y}px`, scale: '0' }], { at: B + 60 + (2 - k) * 70, dur: 400 - (2 - k) * 70, ease: EASE.out, fill: 'forwards' });
    });
    sfx('whoosh', B - 440, 0.5, 0.2);
    sfx('pop2', B + 70, 0.25);
  };

  const anchorOf = item => {
    const jwEl = item.el.querySelector('.jw');
    if (!jwEl) return { x: 640, y: 330 };
    item.el.hidden = false;
    const p = FX.pos(jwEl);
    item.el.hidden = true;
    return { x: p.cx, y: p.cy };
  };

  const transitions = () => {
    // Opening: rings shrink away from the centre.
    ['i1', 'i2', 'i3'].forEach((cls, k) => {
      const ring = document.createElement('div');
      ring.className = `iris ${cls}`;
      ring.style.zIndex = String(k + 1);
      wipes.appendChild(ring);
      add(ring, [{ translate: '640px 360px', scale: '17' }, { translate: '640px 360px', scale: '0' }], { at: 80 + (2 - k) * 90, dur: 520 - (2 - k) * 60, ease: EASE.inOut, fill: 'both' });
    });
    sfx('whoosh', 60, 0.4);
    let n = 0;
    plan.forEach((item, i) => {
      const next = plan[i + 1];
      if (!next || item.kind !== 'scene' || next.kind !== 'scene') return;
      const B = item.t1;
      if (n % 2 === 0) bands(B, n);
      else iris(B, anchorOf(item), anchorOf(next));
      n += 1;
    });
  };

  // 6. Ending: a calm paper veil with the course name and site.
  const outro = () => {
    const veil = document.querySelector('.end-veil');
    const at = lastScene.t1 - 200;
    add(veil, [{ opacity: 0 }, { opacity: 1 }], { at, dur: 900, ease: EASE.inOut });
    FX.popIn(veil.querySelector('.end-brand'), at + 500, { from: 0.6, ease: EASE.spring, dur: 700, sound: 'chime', gain: 0.45 });
    FX.rise(veil.querySelector('small'), at + 900);
  };

  // 7. Build every scene in time order (the pointer requires it), then chrome.
  const build = () => {
    plan.forEach(item => {
      const S = context(item);
      item.el.hidden = false;
      if (item.kind === 'scene') {
        const def = SCENES[item.sc.id];
        if (def.build) def.build(S);
        def.play(S);
      } else {
        CARD.play(S);
      }
      item.el.hidden = true;
    });
    chrome();
    captions();
    transitions();
    outro();
  };

  const waitAssets = async () => {
    await document.fonts.load('600 29px "Pretendard Variable"');
    await document.fonts.load('850 50px "Pretendard Variable"');
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => (img.complete && img.naturalWidth ? img.decode().catch(() => {}) : new Promise(resolve => { img.onload = () => img.decode().then(resolve, resolve); img.onerror = resolve; }))));
  };

  const ready = (async () => {
    if (RENDER) document.documentElement.classList.add('render');
    await waitAssets();
    // Measure layout at the render zoom so positions match captured frames.
    build();
    window.VT.seek(0);
    const missing = [...document.images].filter(img => !img.naturalWidth).map(img => img.src);
    if (missing.length) throw new Error(`Images failed to load: ${missing.join(', ')}`);
    return {
      fps: FPS,
      total: TOTAL,
      frames: Math.ceil((TOTAL / 1000) * FPS),
      scenes: scenesOnly.map(item => ({ id: item.sc.id, t0: item.t0, t1: item.t1, chapter: item.chapter })),
      cards: plan.filter(item => item.kind === 'card').map(item => ({ num: item.card.num, t0: item.t0, t1: item.t1 })),
      captions: scenesOnly.flatMap(item => item.caps.map(cap => ({ t0: cap.t0, t1: cap.t1, text: plain(cap.text) }))),
      sounds: window.VT.sounds.slice().sort((a, b) => a.t - b.t),
      animations: window.VT.anims.length
    };
  })();

  window.VIDEO = { ready, seek: t => window.VT.seek(t), plan, TOTAL, FPS };

  // Preview player: space plays/pauses, arrows seek, [ ] jump scenes.
  if (!RENDER) {
    document.documentElement.classList.add('preview');
    const ui = document.getElementById('player');
    const fit = () => {
      const k = Math.min((innerWidth - 24) / 1280, (innerHeight - 90) / 720);
      stage.style.transform = `scale(${Math.max(0.2, k)})`;
      stage.style.margin = `${(720 * k - 720) / 2}px ${(1280 * k - 1280) / 2}px`;
    };
    addEventListener('resize', fit);
    fit();
    let playing = !params.has('t') && !params.has('scene');
    let origin = 0;
    let t = +params.get('t') || 0;
    ready.then(info => {
      if (params.has('scene')) {
        const hit = info.scenes.find(s => s.id === params.get('scene'));
        if (hit) t = hit.t0;
      }
      const time = document.getElementById('player-time');
      const range = document.getElementById('player-range');
      range.max = String(Math.round(info.total));
      const fmt = ms => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}`;
      const show = () => {
        window.VT.seek(t);
        time.textContent = `${fmt(t)} / ${fmt(info.total)}`;
        range.value = String(Math.round(t));
      };
      const loop = now => {
        if (playing) {
          t = Math.min(info.total, now - origin);
          if (t >= info.total) playing = false;
        }
        show();
        requestAnimationFrame(loop);
      };
      const play = () => { origin = performance.now() - t; playing = true; };
      document.getElementById('player-toggle').addEventListener('click', () => (playing ? (playing = false) : play()));
      range.addEventListener('input', () => { t = +range.value; if (playing) play(); });
      addEventListener('keydown', event => {
        if (event.key === ' ') { event.preventDefault(); if (playing) playing = false; else play(); }
        if (event.key === 'ArrowRight') { t = Math.min(info.total, t + 5000); if (playing) play(); }
        if (event.key === 'ArrowLeft') { t = Math.max(0, t - 5000); if (playing) play(); }
        if (event.key === ']' || event.key === '[') {
          const starts = info.scenes.map(s => s.t0);
          const target = event.key === ']' ? starts.find(s => s > t + 10) : starts.filter(s => s < t - 400).pop();
          if (target !== undefined) { t = target; if (playing) play(); }
        }
      });
      if (playing) play();
      ui.hidden = false;
      requestAnimationFrame(loop);
    }).catch(error => {
      document.getElementById('player-time').textContent = `오류: ${error.message}`;
      throw error;
    });
  }
})();
