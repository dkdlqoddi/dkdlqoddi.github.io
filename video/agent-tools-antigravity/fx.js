/* Motion vocabulary for the video. Entrances and reactions stay quick (0.25–0.6 s);
   the scene pacing comes from caption holds, not from slow movement. */
(() => {
  'use strict';
  const { add, tick, sfx, random, EASE } = window.VT;
  const all = target => (target instanceof Element ? [target] : [...target]);
  const layer = () => document.getElementById('fx-layer');
  const stage = () => document.getElementById('stage');

  // Layout position inside the 1280×720 stage; ignores transforms from animations.
  const pos = el => {
    let x = 0;
    let y = 0;
    let node = el;
    if (!(node instanceof HTMLElement)) {
      const rect = el.getBoundingClientRect();
      const base = stage().getBoundingClientRect();
      const k = base.width / 1280;
      return { x: (rect.left - base.left) / k, y: (rect.top - base.top) / k, w: rect.width / k, h: rect.height / k, get cx() { return this.x + this.w / 2; }, get cy() { return this.y + this.h / 2; } };
    }
    while (node && node !== stage()) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight, cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2 };
  };

  const FX = {
    pos,
    popIn(target, at, { dur = 520, from = 0.5, ease = EASE.spring, stagger = 0, sound = 'pop', gain = 0.6 } = {}) {
      all(target).forEach((el, i) => {
        const t = at + i * stagger;
        add(el, [{ opacity: 0, transform: `scale(${from})` }, { opacity: 1, transform: 'none', offset: 0.3 }, { opacity: 1, transform: 'none' }], { at: t, dur, ease });
        if (sound) sfx(sound, t, gain, (i % 3 - 1) * 0.25);
      });
      return at + (all(target).length - 1) * stagger + dur;
    },
    rise(target, at, { dy = 28, dur = 460, ease = EASE.out, stagger = 0, sound = null, gain = 0.4 } = {}) {
      all(target).forEach((el, i) => {
        const t = at + i * stagger;
        add(el, [{ opacity: 0, transform: `translateY(${dy}px)` }, { opacity: 1, transform: 'none' }], { at: t, dur, ease });
        if (sound) sfx(sound, t, gain);
      });
      return at + (all(target).length - 1) * stagger + dur;
    },
    slide(target, at, { dx = -70, dur = 480, ease = EASE.out, stagger = 0, sound = 'swish', gain = 0.35 } = {}) {
      all(target).forEach((el, i) => {
        const t = at + i * stagger;
        add(el, [{ opacity: 0, transform: `translateX(${dx}px)` }, { opacity: 1, transform: 'none' }], { at: t, dur, ease });
        if (sound) sfx(sound, t, gain, dx < 0 ? -0.3 : 0.3);
      });
      return at + (all(target).length - 1) * stagger + dur;
    },
    drop(target, at, { dy = -90, dur = 620, stagger = 0, sound = 'pop', gain = 0.55 } = {}) {
      all(target).forEach((el, i) => {
        const t = at + i * stagger;
        add(el, [{ opacity: 0, transform: `translateY(${dy}px) rotate(-6deg)` }, { opacity: 1, transform: 'none', offset: 0.35 }, { opacity: 1, transform: 'none' }], { at: t, dur, ease: EASE.bouncy });
        if (sound) sfx(sound, t + 120, gain);
      });
      return at + (all(target).length - 1) * stagger + dur;
    },
    fade(target, at, { dur = 320, from = 0, to = 1, ease = EASE.out } = {}) {
      all(target).forEach(el => add(el, [{ opacity: from }, { opacity: to }], { at, dur, ease }));
      return at + dur;
    },
    // Heading words spring up one after another, like cut-out letters.
    words(root, at, { stagger = 75, dur = 560 } = {}) {
      const items = root.querySelectorAll('.w');
      items.forEach((w, i) => {
        add(w, [
          { opacity: 0, transform: 'translateY(38px) rotate(5deg) scale(.8)' },
          { opacity: 1, transform: 'none', offset: 0.35 },
          { opacity: 1, transform: 'none' }
        ], { at: at + i * stagger, dur, ease: EASE.spring });
      });
      sfx('swish', at, 0.35);
      return at + (items.length - 1) * stagger + dur;
    },
    // Marker stroke behind emphasized words (target is the .mark element).
    mark(target, at, { dur = 380, sound = true } = {}) {
      all(target).forEach(el => add(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at, dur, ease: EASE.out }));
      if (sound) sfx('marker', at, 0.45);
      return at + dur;
    },
    pulse(target, at, { scale = 1.07, dur = 560, sound = null, gain = 0.5 } = {}) {
      all(target).forEach(el => add(el, [{ scale: '1' }, { scale: String(scale), offset: 0.35 }, { scale: '1' }], { at, dur, ease: EASE.inOut, fill: 'none' }));
      if (sound) sfx(sound, at, gain);
      return at + dur;
    },
    wiggle(target, at, { deg = 7, dur = 560 } = {}) {
      all(target).forEach(el => add(el, [
        { rotate: '0deg' }, { rotate: `${-deg}deg`, offset: 0.2 }, { rotate: `${deg}deg`, offset: 0.45 },
        { rotate: `${-deg / 2}deg`, offset: 0.7 }, { rotate: '0deg' }
      ], { at, dur, ease: EASE.linear, fill: 'none' }));
      return at + dur;
    },
    spin(target, at, { turns = 1, dur = 700 } = {}) {
      all(target).forEach(el => add(el, [{ rotate: '0deg' }, { rotate: `${360 * turns}deg` }], { at, dur, ease: EASE.inOut, fill: 'none' }));
      return at + dur;
    },
    // Gentle continuous float (translate) for idle holds.
    bob(target, from, to, { amp = 5, period = 2800, phase = 0 } = {}) {
      const count = Math.max(2, Math.ceil((to - from) / (period / 2)) + 1);
      all(target).forEach(el => add(el, [{ translate: `0 ${-amp}px` }, { translate: `0 ${amp}px` }], {
        at: from - phase, dur: period / 2, ease: EASE.sine, iterations: count, direction: 'alternate', fill: 'none'
      }));
    },
    // Squash-and-stretch hop for the character image.
    hop(target, at, { h = 28, dur = 640, sound = 'boing', gain = 0.35 } = {}) {
      all(target).forEach(el => add(el, [
        { scale: '1 1', translate: '0 0' },
        { scale: '1.1 .88', translate: '0 5px', offset: 0.14 },
        { scale: '.93 1.09', translate: `0 ${-h}px`, offset: 0.42 },
        { scale: '1.06 .94', translate: '0 3px', offset: 0.76 },
        { scale: '1 1', translate: '0 0' }
      ], { at, dur, ease: EASE.linear, fill: 'none' }));
      if (sound) sfx(sound, at, gain);
      return at + dur;
    },
    // Hand-drawn stroke for SVG shapes that carry pathLength="1".
    draw(target, at, { dur = 460, ease = EASE.out, stagger = 0 } = {}) {
      all(target).forEach((el, i) => {
        // Round caps would show a dot at the start before drawing begins.
        add(el, [{ opacity: 0 }, { opacity: 1 }], { at: at + i * stagger, dur: 60, ease: EASE.linear });
        add(el, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { at: at + i * stagger, dur, ease });
      });
      return at + (all(target).length - 1) * stagger + dur;
    },
    // Rubber stamp landing: scale down with a slight twist.
    stamp(target, at, { dur = 380, sound = 'stamp', gain = 0.6, rot = -8 } = {}) {
      all(target).forEach(el => add(el, [
        { opacity: 0, transform: `scale(2.3) rotate(${rot - 14}deg)` },
        { opacity: 1, transform: `scale(.94) rotate(${rot}deg)`, offset: 0.62 },
        { opacity: 1, transform: `scale(1) rotate(${rot}deg)` }
      ], { at, dur, ease: EASE.in }));
      if (sound) sfx(sound, at + dur * 0.6, gain);
      return at + dur;
    },
    // Lime ring highlight that holds until `to`.
    glow(target, at, to, { color = '#d9cf99', ring = 7 } = {}) {
      all(target).forEach(el => {
        const base = getComputedStyle(el).boxShadow;
        const lit = `0 0 0 ${ring}px ${color}, ${base === 'none' ? '4px 5px 0 #59614f' : base}`;
        add(el, [{ boxShadow: base }, { boxShadow: lit }], { at, dur: 260, ease: EASE.out, fill: 'forwards' });
        add(el, [{ boxShadow: lit }, { boxShadow: base }], { at: to, dur: 320, ease: EASE.out, fill: 'forwards' });
      });
    },
    // Guide attention through a group: the focused item lifts, the others soften.
    // segments: [{ i, at, to }]; back-to-back intervals merge so nothing flickers.
    focus(items, segments) {
      const list = [...items];
      list.forEach((el, index) => {
        const spans = segments
          .map(seg => ({ at: seg.at, to: seg.to, state: seg.i === index ? 'lift' : 'dim' }))
          .sort((a, b) => a.at - b.at)
          .reduce((merged, span) => {
            const prev = merged[merged.length - 1];
            if (prev && prev.state === span.state && Math.abs(prev.to - span.at) < 5) prev.to = span.to;
            else merged.push({ ...span });
            return merged;
          }, []);
        spans.forEach(span => {
          if (span.state === 'lift') {
            add(el, [{ translate: '0 0' }, { translate: '0 -8px' }], { at: span.at, dur: 300, ease: EASE.back, fill: 'forwards' });
            add(el, [{ translate: '0 -8px' }, { translate: '0 0' }], { at: span.to, dur: 300, ease: EASE.out, fill: 'forwards' });
          } else {
            add(el, [{ filter: 'opacity(1) saturate(1)' }, { filter: 'opacity(.42) saturate(.6)' }], { at: span.at, dur: 300, ease: EASE.out, fill: 'forwards' });
            add(el, [{ filter: 'opacity(.42) saturate(.6)' }, { filter: 'opacity(1) saturate(1)' }], { at: span.to, dur: 320, ease: EASE.out, fill: 'forwards' });
          }
        });
      });
    },
    // Characters appear at a steady, readable pace with a caret that follows.
    type(box, at, { cps = 24, sound = 'key', gain = 0.22 } = {}) {
      const chars = [...box.querySelectorAll('.ch')];
      const caret = box.querySelector('.caret');
      const step = 1000 / cps;
      const end = at + chars.length * step;
      const origin = pos(box);
      const spots = chars.map(ch => {
        const p = pos(ch);
        return { x: p.x - origin.x, y: p.y - origin.y, w: p.w, h: p.h };
      });
      let shown = -1;
      let caretState = '';
      tick(t => {
        const n = t < at ? 0 : Math.min(chars.length, Math.floor((t - at) / step) + 1);
        if (n !== shown) {
          for (let i = 0; i < chars.length; i++) chars[i].style.opacity = i < n ? '1' : '0';
          shown = n;
        }
        if (caret && spots.length) {
          const spot = n > 0 ? { ...spots[n - 1], x: spots[n - 1].x + spots[n - 1].w } : spots[0];
          const typing = t >= at && t <= end;
          const blinkOn = typing || Math.floor(Math.abs(t - (t < at ? at : end)) / 420) % 2 === 0;
          const visible = t >= at - 700 && t <= end + 2500 && blinkOn;
          const state = `${spot.x}|${spot.y}|${visible}`;
          if (state !== caretState) {
            caret.style.transform = `translate(${spot.x}px, ${spot.y}px)`;
            caret.style.height = `${spot.h}px`;
            caret.style.opacity = visible ? '1' : '0';
            caretState = state;
          }
        }
      });
      for (let i = 0; i < chars.length; i += 2) {
        if (chars[i].textContent.trim()) sfx(sound, at + i * step, gain * (0.8 + (i % 5) * 0.08), 0.15);
      }
      return end;
    },
    // Swap visible text states at given times (e.g. feedback lines).
    swap(states, times) {
      const els = [...states];
      els.forEach((el, i) => {
        if (i > 0) add(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { at: times[i], dur: 360, ease: EASE.out });
        if (i < els.length - 1) add(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { at: times[i + 1] - 180, dur: 200, ease: EASE.in, fill: i === 0 ? 'forwards' : undefined });
      });
    },
    // Burst of paper confetti from a point on the stage.
    confetti(x, y, at, { count = 34, spread = 1, seed = 7, gain = 0.5 } = {}) {
      const rand = random(seed + Math.round(at));
      const colors = ['#d9cf99', '#bdcdbb', '#dec3ac', '#cac2db', '#2c5747', '#c98a5b'];
      for (let i = 0; i < count; i++) {
        const p = document.createElement('i');
        p.className = `confetti c${i % 3}`;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.background = colors[i % colors.length];
        layer().appendChild(p);
        const angle = (-90 + (rand() - 0.5) * 150) * Math.PI / 180;
        const speed = (170 + rand() * 230) * spread;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const fall = 260 + rand() * 180;
        const spinTo = (rand() - 0.5) * 900;
        const dur = 1300 + rand() * 500;
        add(p, [
          { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(.4)' },
          { opacity: 1, transform: `translate(${dx * 0.75}px, ${dy * 0.75}px) rotate(${spinTo * 0.4}deg) scale(1)`, offset: 0.3 },
          { opacity: 1, transform: `translate(${dx}px, ${dy + fall * 0.45}px) rotate(${spinTo * 0.7}deg) scale(1)`, offset: 0.65 },
          { opacity: 0, transform: `translate(${dx * 1.1}px, ${dy + fall}px) rotate(${spinTo}deg) scale(.9)` }
        ], { at: at + rand() * 60, dur, ease: EASE.outSoft, fill: 'both' });
        add(p, [{ visibility: 'hidden' }, { visibility: 'visible' }], { at, dur: 1, ease: EASE.linear, fill: 'backwards' });
      }
      sfx('pop', at, 0.5);
      sfx('sparkle', at + 60, gain);
    },
    // Twinkling four-point stars around an anchor element.
    sparkles(parent, from, to, spots, { period = 1800 } = {}) {
      spots.forEach(([x, y, size, delay], i) => {
        const s = document.createElement('span');
        s.className = 'sparkle';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        s.style.width = s.style.height = `${size}px`;
        s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11Z"/></svg>';
        parent.appendChild(s);
        const iterations = Math.max(1, Math.ceil((to - from) / period));
        add(s, [
          { opacity: 0, transform: 'scale(.2) rotate(0deg)' },
          { opacity: 1, transform: 'scale(1) rotate(45deg)', offset: 0.35 },
          { opacity: 0, transform: 'scale(.2) rotate(90deg)', offset: 0.7 },
          { opacity: 0, transform: 'scale(.2) rotate(90deg)' }
        ], { at: from + (delay || i * 380), dur: period, ease: EASE.inOut, iterations, fill: 'both' });
      });
    }
  };

  // Global pointer used for the practice demos. Calls must run in time order.
  const cursor = { x: 1320, y: 760, t: -Infinity };
  const pointer = () => document.getElementById('cursor');
  const guard = t => {
    if (t < cursor.t) throw new Error(`Cursor steps must be scheduled in order (${t} < ${cursor.t})`);
    cursor.t = t;
  };
  FX.cursor = {
    show(at, x, y) {
      guard(at);
      add(pointer(), [{ translate: `${x}px ${y}px` }, { translate: `${x}px ${y}px` }], { at, dur: 1, ease: EASE.linear });
      add(pointer(), [{ opacity: 0, scale: '.6' }, { opacity: 1, scale: '1' }], { at, dur: 260, ease: EASE.back });
      cursor.x = x;
      cursor.y = y;
      return at + 260;
    },
    move(at, x, y, { dur = 560, arc = 36 } = {}) {
      guard(at);
      const mx = (cursor.x + x) / 2;
      const my = (cursor.y + y) / 2 - arc;
      add(pointer(), [
        { translate: `${cursor.x}px ${cursor.y}px` },
        { translate: `${mx}px ${my}px`, offset: 0.5 },
        { translate: `${x}px ${y}px` }
      ], { at, dur, ease: EASE.inOut });
      cursor.x = x;
      cursor.y = y;
      sfx('swish', at, 0.12);
      return at + dur;
    },
    click(at, { double = false, sound = 'click' } = {}) {
      guard(at);
      const presses = double ? [0, 180] : [0];
      presses.forEach(offset => {
        add(pointer().firstElementChild, [{ scale: '1' }, { scale: '.8', offset: 0.4 }, { scale: '1' }], { at: at + offset, dur: 170, ease: EASE.inOut, fill: 'none' });
        const ring = document.createElement('i');
        ring.className = 'ripple';
        ring.style.left = `${cursor.x}px`;
        ring.style.top = `${cursor.y}px`;
        layer().appendChild(ring);
        add(ring, [{ opacity: 0.85, transform: 'translate(-50%, -50%) scale(.2)' }, { opacity: 0, transform: 'translate(-50%, -50%) scale(1.6)' }], { at: at + offset, dur: 520, ease: EASE.out, fill: 'forwards' });
        add(ring, [{ visibility: 'hidden' }, { visibility: 'visible' }], { at: at + offset, dur: 1, ease: EASE.linear, fill: 'backwards' });
        sfx(sound, at + offset, 0.6);
      });
      return at + (double ? 380 : 200);
    },
    hide(at) {
      guard(at);
      add(pointer(), [{ opacity: 1, scale: '1' }, { opacity: 0, scale: '.7' }], { at, dur: 220, ease: EASE.in });
      return at + 220;
    }
  };

  // Split text nodes into single characters for typing, keeping <br> and inline tags.
  FX.splitChars = el => {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          [...child.textContent].forEach(ch => {
            const span = document.createElement('span');
            span.className = 'ch';
            span.textContent = ch;
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR' && !child.classList.contains('caret')) {
          walk(child);
        }
      });
    };
    walk(el);
    return el;
  };

  // Wrap words of a heading so they can pop one by one; keeps <em> and <br>.
  FX.splitWords = el => {
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = part;
            frag.appendChild(span);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'EM') {
          child.classList.add('w');
          if (!child.querySelector('.mark')) child.insertAdjacentHTML('afterbegin', '<span class="mark" aria-hidden="true"></span>');
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
    return el;
  };

  window.FX = FX;
})();
