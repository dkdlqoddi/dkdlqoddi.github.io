/* Deterministic timeline for the video composition.
   Every motion is a paused Web Animation seeked to one global clock, so any frame
   renders identically regardless of capture order or speed. */
(() => {
  'use strict';

  // Damped spring sampled into CSS linear(); overshoot comes from `damping`.
  const spring = (damping, freq, samples = 60) => {
    const w = 2 * Math.PI * freq;
    const wd = w * Math.sqrt(1 - damping * damping);
    const points = [];
    for (let i = 0; i <= samples; i++) {
      const x = i / samples;
      const t = x * 1.6;
      const v = 1 - Math.exp(-damping * w * t) * (Math.cos(wd * t) + (damping * w / wd) * Math.sin(wd * t));
      points.push(`${(i === samples ? 1 : v).toFixed(4)} ${(x * 100).toFixed(2)}%`);
    }
    return `linear(${points.join(', ')})`;
  };

  const EASE = {
    out: 'cubic-bezier(.16, 1, .3, 1)',
    outSoft: 'cubic-bezier(.22, .9, .3, 1)',
    inOut: 'cubic-bezier(.65, 0, .35, 1)',
    in: 'cubic-bezier(.55, 0, 1, .45)',
    back: 'cubic-bezier(.34, 1.56, .64, 1)',
    spring: spring(0.5, 1.25),
    bouncy: spring(0.36, 1.45),
    sine: 'cubic-bezier(.37, 0, .63, 1)',
    linear: 'linear'
  };

  const anims = [];
  const ticks = [];
  const sounds = [];
  const scenes = [];
  const filled = new WeakMap();

  const propsOf = keyframes => {
    const set = new Set();
    (Array.isArray(keyframes) ? keyframes : [keyframes]).forEach(frame => {
      Object.keys(frame).forEach(key => { if (!['offset', 'easing', 'composite'].includes(key)) set.add(key); });
    });
    return [...set];
  };

  const list = target => (target instanceof Element ? [target] : [...target]);

  // The first animation of a property holds its start state backwards; later ones
  // only hold forwards, so they never override an earlier entrance before they start.
  const add = (target, keyframes, { at, dur, ease = EASE.out, fill, iterations = 1, direction = 'normal' }) => {
    if (!target || (!(target instanceof Element) && !target.length)) throw new Error(`Missing animation target at ${Math.round(at)}ms`);
    if (!Number.isFinite(at) || !Number.isFinite(dur)) throw new Error('Animation time is not a number');
    return list(target).map(el => {
      let mode = fill;
      if (!mode) {
        const seen = filled.get(el) || new Set();
        filled.set(el, seen);
        const props = propsOf(keyframes);
        mode = props.some(prop => seen.has(prop)) ? 'forwards' : 'both';
        props.forEach(prop => seen.add(prop));
      }
      const animation = el.animate(keyframes, {
        duration: Math.max(1, dur), delay: at, easing: ease, fill: mode, iterations, direction
      });
      animation.pause();
      animation.currentTime = 0;
      anims.push(animation);
      return animation;
    });
  };

  const tick = fn => { ticks.push(fn); };
  const sfx = (name, t, gain = 1, pan = 0) => {
    if (Number.isFinite(t)) sounds.push({ name, t: Math.round(t), gain: +gain.toFixed(3), pan: +pan.toFixed(2) });
  };
  const scene = (el, from, to) => { scenes.push({ el, from, to }); };

  // Deterministic pseudo-random numbers for particles and small variations.
  const random = seed => {
    let s = seed >>> 0 || 1;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let r = Math.imul(s ^ (s >>> 15), 1 | s);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  };

  const seek = t => {
    for (const s of scenes) {
      const on = t >= s.from && t < s.to;
      if (s.el.hidden === on) s.el.hidden = !on;
    }
    for (const animation of anims) animation.currentTime = t;
    for (const fn of ticks) fn(t);
  };

  window.VT = { EASE, add, tick, sfx, scene, seek, random, anims, sounds, scenes };
})();
