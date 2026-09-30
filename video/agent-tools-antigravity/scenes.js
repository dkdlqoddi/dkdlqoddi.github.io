/* Scene markup and choreography. Each scene mirrors one deck section; S.b[i] is the
   start of caption i, so every visual beat lands with the sentence that explains it. */
(() => {
  'use strict';
  const { add, sfx, tick, EASE } = window.VT;
  const FX = window.FX;
  const IMG = '../../assets/images/jelly-woo/';

  const ic = (id, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const jw = (pose, cls = '') => `<div class="jw ${cls}"><div class="jw-float"><img class="jw-img" src="${IMG}${pose}@2x.webp" width="1024" height="1024" alt="" decoding="sync"></div><i class="jw-shadow"></i></div>`;
  const ARROW = '<svg class="arrow-svg" viewBox="0 0 46 30" aria-hidden="true"><path class="draw" pathLength="1" d="M4 15h36M28 5l12 10-12 10"/></svg>';
  const STEP_ARROW = '<svg viewBox="0 0 22 22" aria-hidden="true"><path class="draw" pathLength="1" d="M2 11h16M12 5l6 6-6 6"/></svg>';
  const ASTERISK = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4v32M4 20h32M8.7 8.7l22.6 22.6M31.3 8.7 8.7 31.3"/></svg>';
  const CHECK = '<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="11.5" fill="#bdcdbb" stroke="#485047" stroke-width="2"/><path class="draw" pathLength="1" d="M7.5 13.5l3.8 3.8 7.4-8.2"/></svg>';
  const LOCK = '<svg class="icon" viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="20" width="32" height="24" rx="4"/><path class="shackle" d="M15 20V12a9 9 0 0 1 18 0v8"/><path d="M24 29v7"/></svg>';

  const layout = (kind, pose, body) => `<div class="lay-${kind}">${jw(pose)}<div class="main">${body}</div></div>`;

  // Context helpers shared by the scene definitions.
  const local = (S, el) => {
    const p = FX.pos(el);
    const base = FX.pos(S.el);
    return { x: p.x - base.x, y: p.y - base.y, w: p.w, h: p.h, cx: p.cx - base.x, cy: p.cy - base.y };
  };

  const character = (S, at, { from = 'below' } = {}) => {
    const el = S.q('.jw');
    if (!el) return;
    const start = from === 'above' ? 'translateY(-120px) scale(.7) rotate(6deg)' : 'translateY(70px) scale(.5) rotate(-8deg)';
    add(el, [{ opacity: 0, transform: start }, { opacity: 1, transform: 'none', offset: 0.3 }, { opacity: 1, transform: 'none' }], { at, dur: 780, ease: EASE.bouncy });
    sfx('boing', at + 90, 0.3);
    const end = S.t1 + 600;
    FX.bob(el.querySelector('.jw-float'), at + 780, end, { amp: 5, period: 2800 });
    const count = Math.ceil((end - at - 780) / 1400) + 1;
    add(el.querySelector('.jw-shadow'), [{ scale: '.84 1' }, { scale: '1.06 1' }], { at: at + 780, dur: 1400, ease: EASE.sine, iterations: count, direction: 'alternate', fill: 'none' });
  };

  const hop = (S, at, opts) => FX.hop(S.q('.jw-img'), at, opts);

  // Eyebrow, heading words and marker. Returns when the heading has landed.
  const heading = (S, at) => {
    const eyebrow = S.q('.eyebrow');
    if (eyebrow) FX.slide(eyebrow, at, { dx: -40, sound: null });
    const head = S.q('.head');
    if (!head) return at;
    const end = FX.words(head, at + 140);
    const marks = head.querySelectorAll('.mark');
    if (marks.length) FX.mark(marks, end - 140);
    return end;
  };

  const intro = S => {
    character(S, S.in);
    return heading(S, S.in + 160);
  };

  // Dashed placeholders that promise content before it arrives.
  const slots = (S, cards, at, reveal) => {
    [...cards].forEach((card, i) => {
      const box = local(S, card);
      const slot = document.createElement('div');
      slot.className = 'slot';
      Object.assign(slot.style, { left: `${box.x}px`, top: `${box.y}px`, width: `${box.w}px`, height: `${box.h}px` });
      S.el.appendChild(slot);
      add(slot, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { at: at + i * 90, dur: 320, ease: EASE.out });
      add(slot, [{ opacity: 1 }, { opacity: 0 }], { at: reveal[i], dur: 220, ease: EASE.out });
    });
  };

  // Arrows centred in the gaps between adjacent cards.
  const gapArrows = (S, cards, at, stagger = 180) => {
    const list = [...cards];
    for (let i = 0; i < list.length - 1; i++) {
      const a = local(S, list[i]);
      const b = local(S, list[i + 1]);
      const holder = document.createElement('span');
      holder.className = 'step-arrow';
      holder.innerHTML = STEP_ARROW;
      Object.assign(holder.style, { left: `${(a.x + a.w + b.x) / 2 - 11}px`, top: `${a.cy}px` });
      S.el.appendChild(holder);
      FX.draw(holder.querySelector('.draw'), at + i * stagger, { dur: 360 });
    }
  };

  const select = (el, at, to) => {
    add(el, [{ backgroundColor: getComputedStyle(el).backgroundColor }, { backgroundColor: '#bdcdbb' }], { at, dur: 240, ease: EASE.out, fill: 'forwards' });
    add(el, [{ boxShadow: 'inset 0 0 0 0 #2c5747' }, { boxShadow: 'inset 0 0 0 3px #2c5747' }], { at, dur: 240, ease: EASE.out, fill: 'forwards' });
    if (to) {
      add(el, [{ backgroundColor: '#bdcdbb' }, { backgroundColor: getComputedStyle(el).backgroundColor }], { at: to, dur: 260, ease: EASE.out, fill: 'forwards' });
      add(el, [{ boxShadow: 'inset 0 0 0 3px #2c5747' }, { boxShadow: 'inset 0 0 0 0 #2c5747' }], { at: to, dur: 260, ease: EASE.out, fill: 'forwards' });
    }
  };

  const tint = (el, at, color = '#d9cf99', { dur = 260 } = {}) => {
    add(el, [{ backgroundColor: getComputedStyle(el).backgroundColor }, { backgroundColor: color }], { at, dur, ease: EASE.out, fill: 'forwards' });
  };

  const cursorClick = (S, el, at, { show = false, double = false, dx = 0, dy = 0 } = {}) => {
    const p = FX.pos(el);
    const x = p.cx + dx;
    const y = p.cy + dy;
    let t = at;
    if (show) t = FX.cursor.show(t, Math.min(1240, x + 170), Math.min(640, y + 120)) + 40;
    t = FX.cursor.move(t, x, y);
    return FX.cursor.click(t + 60, { double });
  };

  const SCENES = {};

  SCENES.start = {
    html: `
      <div class="cover-frame"><div class="cover-ring"></div><div class="cover-disc"></div>${jw('code')}</div>
      <div class="cover-copy">
        <p class="eyebrow">프롬프트, 그다음 이야기</p>
        <h1 class="head xl">이제 AI에게<br><em>일을</em> 맡겨보세요.</h1>
        <p class="lead">Antigravity로 배우는<br>AI 도구의 첫걸음</p>
        <div class="cover-meta"><span class="pill">Codex</span><span class="pill">Claude Code</span><span class="pill lime">Antigravity</span></div>
        <div class="signpost"><span class="sp">부탁</span><i>→</i><span class="sp">계획</span><i>→</i><span class="sp">작업</span><i>→</i><span class="sp">확인</span></div>
      </div>`,
    play(S) {
      const t = S.in;
      FX.popIn(S.q('.cover-disc'), t, { dur: 760, from: 0.25, ease: EASE.bouncy });
      const ring = S.q('.cover-ring');
      FX.fade(ring, t + 250, { dur: 500 });
      add(ring, [{ rotate: '0deg' }, { rotate: '360deg' }], { at: t, dur: 40000, ease: EASE.linear, iterations: Math.ceil((S.t1 - t) / 40000) + 1, fill: 'none' });
      character(S, t + 280, { from: 'above' });
      FX.sparkles(S.q('.cover-frame'), t + 1100, S.t1, [[18, 48, 30, 0], [352, 16, 22, 500], [372, 318, 28, 950], [-6, 318, 20, 1400]]);
      const landed = heading(S, t + 520);
      FX.rise(S.q('.lead'), landed - 250);
      FX.popIn(S.qa('.cover-meta .pill'), landed + 50, { stagger: 140, from: 0.6, gain: 0.35 });
      FX.popIn(S.q('.signpost'), landed + 520, { from: 0.8, sound: 'pop' });
      // Beats.
      FX.pulse(S.q('.head em'), S.b[1] + 350, { scale: 1.12, sound: 'pop2', gain: 0.5 });
      hop(S, S.b[1] + 200);
      FX.pulse(S.q('.lead'), S.b[2] + 300, { scale: 1.04 });
      hop(S, S.b[2] + 500, { h: 18 });
      S.qa('.signpost .sp').forEach((sp, i) => {
        tint(sp, S.b[3] + 250 + i * 450);
        FX.pulse(sp, S.b[3] + 250 + i * 450, { scale: 1.16, sound: 'tick', gain: 0.5 });
      });
    }
  };

  SCENES.change = {
    html: layout('guide', 'compare', `
      <p class="eyebrow">달라진 것은, AI가 하는 일</p>
      <h2 class="head">답변을 넘어,<br><em>결과물까지.</em></h2>
      <div class="compare">
        <div class="card cmp-card a"><span class="pill">대화 중심</span><div class="big-icon">${ic('chat')}</div><div class="mini-doc"><i></i><i></i><i></i><i style="width:60%"></i></div><h3>“만드는 법을 알려 줘.”</h3><p class="flow"><span class="p1">설명을 읽고<span class="mark"></span></span>→<span class="p2">내가 작업<span class="mark"></span></span></p></div>
        <div class="bridge">${ARROW}</div>
        <div class="card green cmp-card b"><span class="pill">도구를 쓰는 AI</span><div class="big-icon lime">${ic('file')}</div><div class="mini-doc"><i></i><i></i><i style="width:70%"></i><span class="check-dot ok">✓</span></div><h3>“파일로 만들어 줘.”</h3><p class="flow"><span class="p1">AI가 작업<span class="mark"></span></span>→<span class="p2">내가 확인<span class="mark"></span></span></p></div>
      </div>
      <p class="tool-note">${ic('spark')} 지금의 대화형 AI에도 도구가 있어요 · 제품의 세대보다 ‘일하는 방식’의 차이</p>`),
    play(S) {
      intro(S);
      const A = S.q('.cmp-card.a');
      const B = S.q('.cmp-card.b');
      slots(S, [A, B], S.in + 900, [S.b[1] - 150, S.b[2] + 50]);
      FX.slide(A, S.b[1] - 150, { dx: -70, sound: 'pop', gain: 0.55 });
      FX.wiggle(A.querySelector('.big-icon'), S.b[1] + 350);
      A.querySelectorAll('.mini-doc i').forEach((line, i) => add(line, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at: S.b[1] + 450 + i * 110, dur: 320, ease: EASE.out }));
      FX.mark(A.querySelector('.p1 .mark'), S.b[1] + 1300);
      FX.mark(A.querySelector('.p2 .mark'), S.b[1] + 2300);
      FX.draw(S.q('.bridge .draw'), S.b[2] - 250, { dur: 420 });
      FX.popIn(B, S.b[2] + 50, { ease: EASE.bouncy, dur: 700, from: 0.4 });
      const doc = B.querySelector('.mini-doc');
      add(doc, [{ opacity: 0, transform: 'translate(-40px, 24px) scale(.3) rotate(-20deg)' }, { opacity: 1, transform: 'none' }], { at: S.b[2] + 650, dur: 560, ease: EASE.spring });
      sfx('pop2', S.b[2] + 650, 0.5);
      FX.stamp(doc.querySelector('.ok'), S.b[2] + 1250, { sound: 'ding', gain: 0.5, rot: 0 });
      FX.mark(B.querySelector('.p1 .mark'), S.b[2] + 1700);
      FX.mark(B.querySelector('.p2 .mark'), S.b[2] + 2600);
      FX.glow(B, S.b[2] + 700, S.b[3] + 200);
      const note = S.q('.tool-note');
      FX.rise(note, S.b[3], { sound: 'pop', gain: 0.45 });
      FX.spin(note.querySelector('.icon'), S.b[3] + 400, { dur: 800 });
      FX.pulse([A, B], S.b[4] + 250, { scale: 1.04, sound: 'pop2', gain: 0.4 });
      hop(S, S.b[4] + 150);
    }
  };

  SCENES.agent = {
    html: layout('guide', 'connect', `
      <p class="eyebrow">에이전트 = 도구로 일하는 AI</p>
      <h2 class="head">부탁하는 말은 그대로.<br><em>일하는 손이 생겼어요.</em></h2>
      <div class="equation">
        <div class="card eq-unit u1"><div class="big-icon peach">${ic('chat')}</div><h3>프롬프트</h3><p>내가 건네는 부탁</p></div>
        <span class="operator o1">→</span>
        <div class="card eq-unit u2"><div class="big-icon lav">${ic('spark')}</div><h3>AI</h3><p>이해하고 계획</p></div>
        <span class="operator o2">+</span>
        <div class="card toolbox"><span class="pill">쓸 수 있는 도구</span>
          <div class="tool-row">${ic('folder')} 파일 읽기·쓰기</div>
          <div class="tool-row">${ic('screen')} 실행하기</div>
          <div class="tool-row">${ic('browser')} 화면 확인하기</div>
        </div>
      </div>
      <p class="bottom-line">어디까지 일할지는 <strong>내가 준 자료와 권한<span class="mark"></span></strong>에 따라 달라요.</p>`),
    play(S) {
      intro(S);
      const u1 = S.q('.u1');
      const u2 = S.q('.u2');
      const box = S.q('.toolbox');
      // Bracket over AI + tools, named "에이전트".
      const a = local(S, u2);
      const b = local(S, box);
      const brace = document.createElement('div');
      brace.className = 'agent-brace';
      const width = b.x + b.w - a.x;
      Object.assign(brace.style, { left: `${a.x}px`, top: `${Math.min(a.y, b.y) - 44}px`, width: `${width}px` });
      brace.innerHTML = `<svg width="${width}" height="22" viewBox="0 0 ${width} 22" style="overflow:visible"><path class="draw" pathLength="1" d="M4 20V8h${width - 8}v12"/></svg><span class="stamp" style="position:absolute;top:-24px">에이전트</span>`;
      S.el.appendChild(brace);
      slots(S, [u1, u2, box], S.in + 900, [S.b[0] - 100, S.b[1] + 150, S.b[2] + 150]);
      FX.popIn(u1, S.b[0] - 100, { ease: EASE.bouncy, dur: 680 });
      FX.wiggle(u1.querySelector('.big-icon'), S.b[0] + 500);
      FX.popIn(S.q('.o1'), S.b[1] - 100, { from: 0.2, sound: 'tick', gain: 0.4 });
      FX.popIn(u2, S.b[1] + 150, { ease: EASE.bouncy, dur: 680 });
      FX.spin(u2.querySelector('.icon'), S.b[1] + 650, { dur: 900 });
      FX.popIn(S.q('.o2'), S.b[2] - 50, { from: 0.2, sound: 'tick', gain: 0.4 });
      FX.slide(box, S.b[2] + 150, { dx: 80, sound: 'swish' });
      const rows = S.qa('.tool-row');
      FX.popIn(rows, S.b[2] + 700, { stagger: 520, from: 0.7, gain: 0.45 });
      rows.forEach((row, i) => FX.wiggle(row.querySelector('.icon'), S.b[2] + 900 + i * 520, { deg: 10 }));
      FX.draw(brace.querySelector('.draw'), S.b[3] + 100, { dur: 520 });
      FX.stamp(brace.querySelector('.stamp'), S.b[3] + 500, { rot: -3 });
      FX.glow([u2, box], S.b[3] + 400, S.b[4]);
      hop(S, S.b[3] + 700);
      FX.rise(S.q('.bottom-line'), S.b[4] - 50, { sound: 'pop', gain: 0.4 });
      FX.mark(S.q('.bottom-line .mark'), S.b[4] + 700);
    }
  };

  SCENES.tools = {
    html: layout('corner', 'compare', `
      <p class="eyebrow">Codex · Claude Code · Antigravity</p>
      <h2 class="head">같은 원리,<br><em>서로 다른 작업 공간.</em></h2>
      <div class="product-grid">
        <article class="card product p1"><div class="sign ink">C↗</div><p class="maker">OpenAI</p><h3>Codex</h3><p class="surfaces">앱 · 편집기 · 터미널</p><p class="bottom">작업을 맡기고<br>변경 내용 확인</p></article>
        <article class="card product p2"><div class="sign clay">${ASTERISK}</div><p class="maker">Anthropic</p><h3>Claude Code</h3><p class="surfaces">터미널 · 편집기 · 앱</p><p class="bottom">파일을 고치고<br>명령을 실행</p></article>
        <article class="card product featured p3"><span class="ribbon">오늘의 실습</span><div class="sign forest">A↗</div><p class="maker">Google</p><h3>Antigravity</h3><p class="surfaces">앱 · 편집기 · 터미널</p><p class="bottom">계획과 결과를<br>시각적으로 확인</p></article>
      </div>
      <p class="note">셋 다 파일 작업과 실행을 돕습니다. 위 설명은 대표 경험이며, 한 제품만의 전용 기능은 아닙니다.</p>`),
    play(S) {
      intro(S);
      const cards = S.qa('.product');
      FX.drop(cards, S.b[0] - 50, { stagger: 180 });
      S.qa('.sign').forEach((sign, i) => FX.spin(sign, S.b[0] + 350 + i * 180, { dur: 700 }));
      cards.forEach((card, i) => {
        FX.pulse(card, S.b[1] + 250 + i * 1150, { scale: 1.05, sound: 'pop2', gain: 0.45 });
        FX.wiggle(card.querySelector('.sign'), S.b[1] + 300 + i * 1150, { deg: 12 });
      });
      FX.pulse(cards, S.b[2] + 300, { scale: 1.035 });
      S.qa('.surfaces').forEach((line, i) => tint(line, S.b[2] + 500 + i * 260, '#d9cf9999'));
      S.qa('.surfaces').forEach((line, i) => tint(line, S.b[3] + 100 + i * 60, 'rgba(0,0,0,0)'));
      FX.rise(S.q('.note'), S.b[3], { sound: 'pop', gain: 0.35 });
      FX.stamp(S.q('.ribbon'), S.b[4] + 250, { rot: 4 });
      FX.focus(cards, [{ i: 2, at: S.b[4] + 200, to: S.t1 + 500 }]);
      FX.glow(cards[2], S.b[4] + 400, S.t1 + 500);
      hop(S, S.b[4] + 500);
    }
  };

  SCENES.loop = {
    html: layout('guide', 'plan', `
      <p class="eyebrow">새로운 협업 방식</p>
      <h2 class="head">나는 방향을 정하고,<br><em>AI와 함께 완성해요.</em></h2>
      <div class="process four">
        <div class="card step s1"><span class="num">01</span>${ic('chat')}<h3>부탁</h3><span class="owner">내가</span></div>
        <div class="card step s2"><span class="num">02</span>${ic('file')}<h3>계획</h3><span class="owner">AI와 함께</span></div>
        <div class="card step s3"><span class="num">03</span>${ic('spark')}<h3>작업</h3><span class="owner">AI가</span></div>
        <div class="card step em s4"><span class="num">04</span>${ic('eye')}<h3>확인</h3><span class="owner">내가</span></div>
      </div>
      <div class="return-loop"><svg viewBox="0 0 900 64" preserveAspectRatio="none" aria-hidden="true"><path class="draw loop-path" pathLength="1" d="M796 0C796 42 770 50 712 50H192C134 50 104 42 104 8"/><path class="draw loop-head" pathLength="1" d="M94 16 104 4 114 16"/></svg><span class="label"><svg viewBox="0 0 48 48" aria-hidden="true" class="icon"><path d="M17 10 8 19l9 9"/><path d="M8 19h19a11 11 0 0 1 0 22h-7"/></svg>원하는 모습이 될 때까지, 수정 부탁</span><i class="token"></i></div>`),
    play(S) {
      intro(S);
      const steps = S.qa('.step');
      FX.popIn(steps, S.b[0] + 50, { stagger: 220, ease: EASE.bouncy, dur: 640 });
      gapArrows(S, steps, S.b[0] + 350, 220);
      steps.forEach((step, i) => FX.wiggle(step.querySelector('.icon'), S.b[0] + 400 + i * 220));
      const half1 = (S.b[1] + S.e[1]) / 2 + 200;
      const half2 = (S.b[2] + S.e[2]) / 2 + 200;
      FX.focus(steps, [
        { i: 0, at: S.b[1] + 100, to: half1 },
        { i: 1, at: half1, to: S.e[1] + 150 },
        { i: 2, at: S.b[2] + 100, to: half2 },
        { i: 3, at: half2, to: S.e[2] + 150 }
      ]);
      [S.b[1] + 100, half1, S.b[2] + 100, half2].forEach(t => sfx('pop2', t, 0.35));
      const loop = S.q('.return-loop');
      FX.draw(loop.querySelector('.loop-path'), S.b[3] + 100, { dur: 900, ease: EASE.inOut });
      FX.draw(loop.querySelector('.loop-head'), S.b[3] + 950, { dur: 260 });
      FX.popIn(loop.querySelector('.label'), S.b[3] + 700, { from: 0.6, gain: 0.45 });
      const token = loop.querySelector('.token');
      token.style.offsetPath = "path('M796 0C796 42 770 50 712 50H192C134 50 104 42 104 8')";
      token.style.offsetRotate = '0deg';
      const lap = 1900;
      add(token, [{ opacity: 0 }, { opacity: 1 }], { at: S.b[3] + 1100, dur: 200 });
      add(token, [{ offsetDistance: '0%' }, { offsetDistance: '100%' }], { at: S.b[3] + 1100, dur: lap, ease: EASE.inOut, iterations: Math.max(2, Math.floor((S.t1 - S.b[3] - 1100) / lap)), fill: 'both' });
      FX.glow(steps[3], S.b[4] + 200, S.t1 + 500);
      const stamp = document.createElement('span');
      stamp.className = 'stamp';
      const box = local(S, steps[3]);
      Object.assign(stamp.style, { left: `${box.x + box.w - 96}px`, top: `${box.y - 22}px` });
      stamp.textContent = '최종 확인';
      S.el.appendChild(stamp);
      FX.stamp(stamp, S.b[4] + 500, { rot: 6 });
      hop(S, S.b[4] + 800);
    }
  };

  SCENES.possibilities = {
    html: layout('guide', 'idea', `
      <p class="eyebrow">코드를 몰라도, 하고 싶은 일은 있으니까</p>
      <h2 class="head">내 일에 필요한<br><em>작은 결과물부터.</em></h2>
      <div class="usecases">
        <article class="card usecase peach u1"><div class="art art-book"><div class="cover"></div><div class="lines"><span>읽은 책</span><i></i><i></i><i style="width:70%"></i></div></div><h3>독서 기록</h3><p>메모 → 읽기 좋은 목록</p></article>
        <article class="card usecase lav u2"><div class="art art-gallery"><i></i><i></i><i></i></div><h3>전시 소개</h3><p>작품 정보 → 소개 페이지</p></article>
        <article class="card usecase green u3"><div class="art art-cal"><div class="page"><span>OCTOBER</span><strong class="flip">10</strong></div></div><h3>모임 안내</h3><p>날짜·장소 → 안내 페이지</p></article>
      </div>`),
    play(S) {
      intro(S);
      FX.sparkles(S.q('.jw'), S.in + 900, S.t1, [[150, 4, 26, 0], [186, 58, 18, 600], [18, 30, 20, 1100]]);
      const cards = S.qa('.usecase');
      slots(S, cards, S.in + 950, [S.b[1] - 100, S.b[2] - 100, S.b[3] - 100]);
      [1, 2, 3].forEach((k, i) => FX.popIn(cards[i], S.b[k] - 100, { ease: EASE.bouncy, dur: 680 }));
      add(S.qa('.art-book .lines i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at: S.b[1] + 450, dur: 380, ease: EASE.out });
      FX.wiggle(S.q('.art-book .cover'), S.b[1] + 500, { deg: 8 });
      FX.drop(S.qa('.art-gallery i'), S.b[2] + 350, { stagger: 170, dy: -120 });
      const flip = S.q('.art-cal .flip');
      add(flip, [{ transform: 'rotateX(90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { at: S.b[3] + 500, dur: 520, ease: EASE.bouncy });
      sfx('ding', S.b[3] + 600, 0.35);
      FX.pulse(cards, S.b[4] + 250, { scale: 1.05, sound: 'pop2', gain: 0.4 });
      hop(S, S.b[4] + 400);
    }
  };

  SCENES.mission = {
    html: layout('guide', 'present', `
      <div class="split">
        <div class="mcopy">
          <p class="eyebrow">오늘의 작은 실습</p>
          <h2 class="head">안내 페이지<br><em>한 장 만들기.</em></h2>
          <p class="lead">설명만 듣는 것에서<br>직접 열어 보는 것까지.</p>
          <span class="vtag">${ic('lock')} 가상의 모임 정보로 연습해요</span>
          <div class="goals"><span class="g1"><span class="check-dot">✓</span>제목</span><span class="g2"><span class="check-dot">✓</span>날짜</span><span class="g3"><span class="check-dot">✓</span>장소</span><span class="g4"><span class="check-dot">✓</span>큰 글씨</span></div>
        </div>
        <div class="browser ev">
          <div class="browser-bar"><span class="dots3"><i></i><i></i><i></i></span><span>모임 안내.html</span></div>
          <div class="event"><span class="etag">함께 읽는 즐거움</span><div class="books"><i></i><i></i><i></i></div><h3>우리 동네<br>책모임</h3><p class="info i1">${ic('calendar')} 10월 10일 · 오후 2시</p><p class="info i2">${ic('folder')} 동네 도서관 2층</p><div class="ebottom">책 한 권, 편안한 마음.</div></div>
          <span class="stamp vstamp">가상 예시</span>
        </div>
      </div>
      <span class="file-chip">${ic('file')} 모임 안내.html</span>`),
    play(S) {
      intro(S);
      FX.rise(S.q('.lead'), S.in + 1150);
      const win = S.q('.browser');
      FX.popIn(win, S.b[0] + 100, { ease: EASE.bouncy, dur: 700, from: 0.35 });
      FX.slide(S.q('.etag'), S.b[0] + 600, { dx: -30, sound: null });
      FX.drop(S.qa('.books i'), S.b[0] + 750, { stagger: 150, dy: -60 });
      FX.rise(S.q('.event h3'), S.b[0] + 1200, { sound: 'pop', gain: 0.35 });
      FX.rise(S.qa('.event .info'), S.b[0] + 1500, { stagger: 220 });
      FX.fade(S.q('.ebottom'), S.b[0] + 1900);
      FX.popIn(S.q('.vtag'), S.b[1] + 100, { from: 0.6, gain: 0.45 });
      FX.stamp(S.q('.vstamp'), S.b[1] + 600, { rot: 8 });
      FX.glow(S.qa('.event .info'), S.b[1] + 900, S.e[1]);
      const chip = S.q('.file-chip');
      FX.popIn(chip, S.b[2] + 100, { from: 0.6, gain: 0.4 });
      const clicked = cursorClick(S, chip, S.b[2] + 500, { show: true, double: true });
      FX.pulse(win, clicked + 60, { scale: 1.04, sound: 'pop2', gain: 0.45 });
      add(win.querySelector('.event'), [{ opacity: 1 }, { opacity: 0.35, offset: 0.3 }, { opacity: 1 }], { at: clicked + 60, dur: 520, ease: EASE.out, fill: 'none' });
      add(chip, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate(90px, -40px) scale(.4)' }], { at: clicked + 80, dur: 380, ease: EASE.in });
      FX.cursor.hide(clicked + 700);
      const goals = S.qa('.goals > span');
      FX.popIn(goals, S.b[3] + 150, { stagger: 330, from: 0.5, sound: 'ding', gain: 0.3 });
      const g = FX.pos(goals[goals.length - 1]);
      FX.confetti(g.cx, g.cy, S.b[3] + 1350, { count: 22, spread: 0.7 });
      hop(S, S.b[3] + 1300);
    }
  };

  SCENES.install = {
    html: layout('guide', 'code', `
      <p class="eyebrow">준비 1 · 인터넷이 연결된 컴퓨터</p>
      <h2 class="head">Antigravity를<br><em>열어볼까요?</em></h2>
      <div class="process three">
        <div class="card step i1"><span class="num">01</span>${ic('browser')}<h3>공식 사이트</h3><span class="url-chip"><span class="typed">antigravity.google/download</span><i class="caret"></i></span></div>
        <div class="card step i2"><span class="num">02</span>${ic('screen')}<h3>내 컴퓨터용 설치</h3><p>Windows · macOS</p><div class="bar"><i></i></div></div>
        <div class="card step em i3"><span class="num">03</span>${ic('user')}<h3>실행 후 로그인</h3><p>내 Google 계정</p><span class="check-dot ok">✓</span></div>
      </div>
      <p class="note basis">실습 기준: <b>Antigravity 2.0 데스크톱</b> · 이용 조건과 사용량은 공식 안내에서 확인하세요.</p>
      <span class="warn-chip">${LOCK} 비밀번호는 AI 대화창에 넣지 않기</span>`),
    build(S) { FX.splitChars(S.q('.url-chip .typed')); },
    play(S) {
      intro(S);
      const steps = S.qa('.step');
      FX.popIn(steps, S.b[0] + 50, { stagger: 200, ease: EASE.bouncy, dur: 640 });
      gapArrows(S, steps, S.b[0] + 400, 200);
      FX.focus(steps, [
        { i: 0, at: S.b[1] + 50, to: S.b[2] + 50 },
        { i: 1, at: S.b[2] + 50, to: S.b[3] + 50 },
        { i: 2, at: S.b[3] + 50, to: S.e[3] + 150 }
      ]);
      FX.type(S.q('.url-chip'), S.b[1] + 500, { cps: 16 });
      const bar = S.q('.bar i');
      add(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at: S.b[2] + 600, dur: 1700, ease: EASE.inOut });
      sfx('rise', S.b[2] + 600, 0.3);
      FX.wiggle(steps[1].querySelector('.icon'), S.b[2] + 2300);
      sfx('ding', S.b[2] + 2300, 0.4);
      FX.stamp(S.q('.i3 .ok'), S.b[3] + 800, { sound: 'ding', gain: 0.45, rot: 0 });
      FX.wiggle(steps[2].querySelector('.icon'), S.b[3] + 250);
      FX.rise(S.q('.basis'), S.b[4] - 50, { sound: 'pop', gain: 0.35 });
      FX.pulse(S.q('.basis b'), S.b[4] + 700, { scale: 1.08 });
      const warn = S.q('.warn-chip');
      FX.popIn(warn, S.b[5] - 50, { from: 0.5, ease: EASE.bouncy, dur: 620 });
      add(warn.querySelector('.shackle'), [{ transform: 'translateY(-7px)' }, { transform: 'none' }], { at: S.b[5] + 500, dur: 380, ease: EASE.bouncy });
      sfx('lock', S.b[5] + 560, 0.5);
      add(warn, [{ translate: '0 0' }, { translate: '-6px 0', offset: 0.25 }, { translate: '6px 0', offset: 0.5 }, { translate: '-3px 0', offset: 0.75 }, { translate: '0 0' }], { at: S.b[5] + 900, dur: 420, ease: EASE.linear, fill: 'none' });
    }
  };

  SCENES.folder = {
    html: layout('guide', 'code', `
      <p class="eyebrow">준비 2 · 작업할 자리 만들기</p>
      <h2 class="head">연습용 폴더가<br><em>AI의 작업 책상.</em></h2>
      <div class="folder-layout">
        <div class="folder-art">
          <div class="fold"><svg class="copy" viewBox="0 0 170 130" aria-hidden="true"><path class="back" d="M6 22V10a6 6 0 0 1 6-6h46l14 14h86a6 6 0 0 1 6 6v98H6Z"/><path class="front" d="M6 40h158v82a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z"/></svg><svg class="orig" viewBox="0 0 170 130" aria-hidden="true"><path class="back" d="M6 22V10a6 6 0 0 1 6-6h46l14 14h86a6 6 0 0 1 6 6v98H6Z"/><path class="front" d="M6 40h158v82a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z"/></svg><span class="pill copy-tag">복사본</span></div>
          <h3 class="fname"><span class="typed">AI-연습</span><i class="caret"></i></h3>
          <p>컴퓨터에 새 폴더 만들기</p>
        </div>
        <ol class="setup">
          <li class="card f1"><span class="n">1</span><span class="t">새 프로젝트</span><span class="keys"><span class="key">폴더 +</span>→<span class="key k-new">New Project</span></span><span class="check-dot ok">✓</span></li>
          <li class="card f2"><span class="n">2</span><span class="t">연습 폴더 연결</span><span class="keys"><span class="key k-add">Add Folder</span>→<span class="key">AI-연습</span></span><span class="check-dot ok">✓</span></li>
          <li class="card f3"><span class="n">3</span><span class="t">만들기</span><span class="keys"><span class="key k-create">Create</span></span><span class="check-dot ok">✓</span></li>
        </ol>
      </div>
      <div class="folder-notes"><span class="ide-chip">${ic('screen')} Antigravity IDE에서는 <b>Open Folder</b>로 열기</span><span class="note small">메뉴 이름은 2026-09-20 공식 문서 기준이에요</span></div>`),
    build(S) { FX.splitChars(S.q('.fname .typed')); },
    play(S) {
      intro(S);
      const art = S.q('.folder-art .fold');
      FX.popIn(art, S.b[0] + 50, { ease: EASE.bouncy, dur: 700, from: 0.3 });
      FX.fade(S.q('.folder-art p'), S.b[0] + 400);
      FX.sparkles(S.q('.folder-art'), S.b[0] + 600, S.t1, [[40, 20, 22, 0], [196, 60, 18, 700]]);
      FX.type(S.q('.fname'), S.b[1] + 300, { cps: 9 });
      const front = S.q('.fold .orig .front');
      add(front, [{ transform: 'none' }, { transform: 'scaleY(.78) skewX(-10deg)', offset: 0.4 }, { transform: 'none' }], { at: S.b[1] + 1300, dur: 700, ease: EASE.inOut, fill: 'none' });
      sfx('pop2', S.b[1] + 1300, 0.4);
      const items = S.qa('.setup li');
      FX.slide(items[0], S.b[2] - 100, { dx: 70, sound: 'pop', gain: 0.4 });
      let t = cursorClick(S, S.q('.k-new'), S.b[2] + 600, { show: true });
      tint(S.q('.k-new'), t - 150);
      FX.stamp(items[0].querySelector('.ok'), t + 100, { sound: 'ding', gain: 0.35, rot: 0 });
      FX.slide(items[1], S.b[3] - 100, { dx: 70, sound: 'pop', gain: 0.4 });
      t = cursorClick(S, S.q('.k-add'), S.b[3] + 500);
      tint(S.q('.k-add'), t - 150);
      FX.stamp(items[1].querySelector('.ok'), t + 100, { sound: 'ding', gain: 0.35, rot: 0 });
      FX.slide(items[2], t + 300, { dx: 70, sound: 'pop', gain: 0.4 });
      t = cursorClick(S, S.q('.k-create'), t + 800);
      tint(S.q('.k-create'), t - 150);
      FX.stamp(items[2].querySelector('.ok'), t + 100, { sound: 'ding', gain: 0.35, rot: 0 });
      FX.cursor.hide(Math.max(t + 600, S.b[4] - 300));
      FX.popIn(S.q('.ide-chip'), S.b[4] + 50, { from: 0.6, gain: 0.45 });
      FX.fade(S.q('.folder-notes .note'), S.b[4] + 600);
      const copy = S.q('.fold .copy');
      add(copy, [{ transform: 'none' }, { transform: 'translate(26px, -16px) rotate(6deg)' }], { at: S.b[5] + 200, dur: 560, ease: EASE.spring });
      sfx('swish', S.b[5] + 200, 0.4);
      FX.popIn(S.q('.copy-tag'), S.b[5] + 600, { from: 0.5, gain: 0.4 });
      hop(S, S.b[5] + 400);
    }
  };

  SCENES.workspace = {
    html: layout('corner', 'present', `
      <p class="eyebrow">화면을 익히는 세 가지 단어</p>
      <h2 class="head">자료. 대화. <em>결과.</em></h2>
      <div class="card mock">
        <div class="mock-title"><span>Antigravity · AI-연습</span><span class="mock-badge">학습용 화면 모형</span></div>
        <div class="panels">
          <div class="panel z1"><span class="zone">1</span>${ic('folder')}<strong>자료</strong><div class="file-row">${ic('folder')} AI-연습</div><div class="file-row inset">${ic('file')} 안내.html</div></div>
          <div class="panel z2"><span class="zone">2</span>${ic('chat')}<strong>대화</strong><span class="bubble me">모임 안내를 만들어 줘.</span><span class="bubble">먼저 계획을 보여드릴게요.</span></div>
          <div class="panel z3"><span class="zone">3</span>${ic('browser')}<strong>결과</strong><div class="mini-out"><span>우리 동네<br>책모임</span><span>↗</span></div></div>
        </div>
      </div>`),
    play(S) {
      intro(S);
      const mock = S.q('.mock');
      FX.popIn(mock, S.b[0] + 50, { ease: EASE.spring, dur: 640, from: 0.6 });
      const panels = S.qa('.panel');
      FX.rise(panels, S.b[0] + 350, { stagger: 150 });
      FX.popIn(S.qa('.zone'), S.b[0] + 700, { stagger: 150, from: 0.2, sound: 'tick', gain: 0.35 });
      let t = cursorClick(S, panels[0], S.b[1] + 150, { show: true, dy: -40 });
      select(panels[0], t - 120, S.b[2] + 700);
      FX.popIn(S.qa('.z1 .file-row'), t + 150, { stagger: 260, from: 0.6, gain: 0.35 });
      t = cursorClick(S, panels[1], S.b[2] + 300, { dy: -60 });
      select(panels[1], t - 120, S.b[3] + 700);
      FX.popIn(S.q('.z2 .bubble.me'), t + 150, { from: 0.5, gain: 0.45 });
      FX.popIn(S.q('.z2 .bubble:not(.me)'), t + 1200, { from: 0.5, gain: 0.45 });
      t = cursorClick(S, panels[2], S.b[3] + 300, { dy: -40 });
      select(panels[2], t - 120);
      FX.popIn(S.q('.mini-out'), t + 150, { from: 0.5, ease: EASE.bouncy, dur: 620 });
      FX.cursor.hide(S.b[4] - 200);
      FX.glow(S.q('.mock-badge'), S.b[4] + 150, S.t1 + 400, { ring: 5 });
      FX.pulse(S.q('.mock-badge'), S.b[4] + 200, { scale: 1.12, sound: 'pop2', gain: 0.4 });
      hop(S, S.b[4] + 500);
    }
  };

  SCENES.settings = {
    html: layout('guide', 'approve', `
      <p class="eyebrow">처음에는, 한 번씩 확인하며</p>
      <h2 class="head">계획부터 보고,<br><em>진행을 허락해요.</em></h2>
      <div class="settings-grid">
        <article class="card setting s1"><span class="label">대화의 작업 방식</span><div class="choice">${ic('file')}<span class="txt">Planning<small>먼저 계획하기</small></span><span class="radio r1"><i></i></span></div></article>
        <article class="card green setting s2"><span class="label"><span class="crumb c1">Settings</span>→<span class="crumb c2">Agent</span>→<span class="crumb c3">Artifact Review</span></span><div class="choice">${ic('hand')}<span class="txt">Request Review<small>계획을 확인한 뒤 진행</small></span><span class="radio r2"><i></i></span></div></article>
      </div>
      <div class="mini-flow"><span class="mf1">${ic('file')} 계획 보기</span><b>→</b><span class="mf2">${ic('eye')} 내가 확인</span><b>→</b><span class="mf3">${ic('spark')} 진행</span></div>
      <p class="bottom-line">명령 실행·웹 접근의 <strong>권한 요청도 따로 확인<span class="mark"></span></strong>해요.</p>
      <p class="note small">학습용 모형 · 설정 이름과 위치는 버전에 따라 바뀔 수 있어요.</p>`),
    play(S) {
      intro(S);
      const cards = S.qa('.setting');
      FX.popIn(cards, S.b[0] + 50, { stagger: 220, ease: EASE.bouncy, dur: 640 });
      let t = cursorClick(S, S.q('.r1'), S.b[1] + 400, { show: true });
      add(S.q('.r1 i'), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { at: t - 120, dur: 420, ease: EASE.bouncy });
      FX.glow(cards[0], t, S.b[2]);
      S.qa('.crumb').forEach((crumb, i) => {
        tint(crumb, S.b[2] + 250 + i * 520);
        FX.pulse(crumb, S.b[2] + 250 + i * 520, { scale: 1.12, sound: 'tick', gain: 0.45 });
      });
      t = cursorClick(S, S.q('.r2'), S.b[2] + 1900);
      add(S.q('.r2 i'), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { at: t - 120, dur: 420, ease: EASE.bouncy });
      FX.glow(cards[1], t, S.b[3] + 200);
      FX.cursor.hide(Math.max(t + 500, S.b[3] - 200));
      const flow = S.q('.mini-flow');
      FX.popIn(flow.querySelectorAll('span'), S.b[3] + 150, { stagger: 480, from: 0.5, gain: 0.4 });
      FX.popIn(flow.querySelectorAll('b'), S.b[3] + 400, { stagger: 480, from: 0.2, sound: null });
      FX.rise(S.q('.bottom-line'), S.b[4] - 50, { sound: 'pop', gain: 0.4 });
      FX.mark(S.q('.bottom-line .mark'), S.b[4] + 650);
      FX.rise(S.q('.note.small'), S.b[5] - 50);
      FX.pulse(S.q('.note.small'), S.b[5] + 500, { scale: 1.05 });
      hop(S, S.b[5] + 300);
    }
  };

  SCENES.request = {
    html: layout('guide', 'code', `
      <p class="eyebrow">실습 1 · 대화창에 입력하기</p>
      <h2 class="head">무엇을, 어떤 모습으로?</h2>
      <div class="card sheet">
        <div class="sheet-top"><span>${ic('chat')} 이렇게 부탁해 보세요</span><span class="send">${ic('send')}</span></div>
        <div class="prompt"><span class="hl make">우리 동네 책모임 안내 페이지<span class="mark"></span></span>를 만들어 줘.<br><span class="hl info">10월 10일 오후 2시, 동네 도서관 2층<span class="mark"></span></span>이야.<br><span class="hl shape">흰 배경에 큰 글씨로, 휴대전화에서도 읽기 쉽게.<span class="mark"></span></span><br>설치 없이 열 수 있는 <span class="hl shape">안내.html 파일 하나<span class="mark"></span></span>로 만들어 줘.<br><span class="hl plan">만들기 전에 계획부터 보여 줘.<span class="mark"></span></span> <span class="hl shape">인터넷에 공개하지 마.<span class="mark"></span></span><i class="caret"></i></div>
      </div>
      <div class="prompt-tags"><span class="tg1"><i style="background:#dec3ac"></i>만들 것</span><span class="tg2"><i style="background:#cac2db"></i>필요한 정보</span><span class="tg3"><i style="background:#bdcdbb"></i>원하는 모습·범위</span><span class="copy-note">${ic('copy')} 웹 발표자료에서 복사하기</span></div>`),
    build(S) { FX.splitChars(S.q('.prompt')); },
    play(S) {
      intro(S);
      const sheet = S.q('.sheet');
      FX.popIn(sheet, S.b[0] - 200, { ease: EASE.spring, dur: 620, from: 0.7 });
      const typed = FX.type(S.q('.prompt'), S.b[0] + 700, { cps: 25 });
      FX.pulse(S.q('.send'), typed + 400, { scale: 1.15, sound: 'pop2', gain: 0.35 });
      const tags = S.qa('.prompt-tags > span:not(.copy-note)');
      FX.mark(S.qa('.hl.make .mark'), S.b[1] + 250);
      FX.popIn(tags[0], S.b[1] + 150, { from: 0.5, gain: 0.4 });
      FX.mark(S.qa('.hl.info .mark'), S.b[2] + 250);
      FX.popIn(tags[1], S.b[2] + 150, { from: 0.5, gain: 0.4 });
      S.qa('.hl.shape .mark').forEach((mark, i) => FX.mark(mark, S.b[3] + 250 + i * 520, { sound: i === 0 }));
      FX.popIn(tags[2], S.b[3] + 150, { from: 0.5, gain: 0.4 });
      FX.mark(S.qa('.hl.plan .mark'), S.b[4] + 250);
      hop(S, S.b[4] + 400);
      const t = cursorClick(S, S.q('.send'), S.b[4] + 1300, { show: true });
      FX.pulse(S.q('.send'), t - 100, { scale: 1.2 });
      const sent = document.createElement('span');
      sent.className = 'stamp';
      const box = local(S, S.q('.send'));
      Object.assign(sent.style, { left: `${box.x - 70}px`, top: `${box.y + 46}px` });
      sent.textContent = '보냈어요';
      S.el.appendChild(sent);
      FX.stamp(sent, t + 150, { rot: -6, sound: 'whoosh', gain: 0.3 });
      FX.cursor.hide(t + 900);
      const note = S.q('.copy-note');
      FX.popIn(note, S.b[5] + 50, { from: 0.5, ease: EASE.bouncy, dur: 620 });
      FX.wiggle(note.querySelector('.icon'), S.b[5] + 600, { deg: 12 });
    }
  };

  SCENES.plan = {
    html: layout('guide', 'review', `
      <div class="split">
        <div class="pcopy">
          <p class="eyebrow">실습 2 · 계획 검토</p>
          <h2 class="head">내가 부탁한<br><em>일이 맞나요?</em></h2>
          <div class="chips3"><span class="c1">내용</span><span class="c2">작업 범위</span><span class="c3">공개 여부</span></div>
          <span class="say bubble me">“쉬운 말로 풀어 줘.”</span>
        </div>
        <div class="card plan-sheet">
          <div class="plan-head">${ic('file')}<span><b>만들기 전 계획</b><small>학습용 모형</small></span></div>
          <ul class="check-list"><li class="k1">${CHECK} 책모임 날짜·장소 넣기</li><li class="k2">${CHECK} 안내 파일 하나 만들기</li><li class="k3">${CHECK} 내 컴퓨터에서만 확인</li></ul>
          <span class="btn go">계획 확인 · 진행 <span aria-hidden="true">→</span></span>
          <div class="feedback"><p class="f0">내 부탁과 맞으면 진행 버튼을 눌러요.</p><p class="f1 done">연습 완료! 실제 앱에서는 Proceed를 누르면 작업을 시작해요.</p></div>
        </div>
      </div>`),
    play(S) {
      intro(S);
      const sheet = S.q('.plan-sheet');
      FX.slide(sheet, S.b[0] - 100, { dx: 90, sound: 'swish' });
      const items = S.qa('.check-list li');
      add(items, [{ opacity: 0 }, { opacity: 0.35 }], { at: S.b[0] + 400, dur: 300 });
      FX.fade(S.qa('.chips3 span'), S.b[0] + 500, { dur: 300, to: 0.5 });
      [1, 2, 3].forEach((k, i) => {
        add(items[i], [{ opacity: 0.35 }, { opacity: 1 }], { at: S.b[k] + 150, dur: 260 });
        FX.draw(items[i].querySelector('.draw'), S.b[k] + 350, { dur: 360 });
        sfx('ding', S.b[k] + 500, 0.35);
        const chip = S.qa('.chips3 span')[i];
        add(chip, [{ opacity: 0.5 }, { opacity: 1 }], { at: S.b[k] + 100, dur: 240 });
        tint(chip, S.b[k] + 100);
        FX.pulse(chip, S.b[k] + 100, { scale: 1.1 });
      });
      FX.popIn(S.q('.say'), S.b[4] + 50, { from: 0.4, ease: EASE.bouncy, dur: 640 });
      hop(S, S.b[4] + 300, { h: 18 });
      const t = cursorClick(S, S.q('.go'), S.b[5] + 300, { show: true });
      FX.pulse(S.q('.go'), t - 120, { scale: 0.94, dur: 260 });
      FX.swap(S.qa('.feedback p'), [0, t + 100]);
      const p = FX.pos(S.q('.go'));
      FX.confetti(p.cx, p.cy, t + 150, { count: 18, spread: 0.6 });
      FX.cursor.hide(t + 800);
    }
  };

  SCENES['open-result'] = {
    html: layout('guide', 'review', `
      <p class="eyebrow">실습 3 · 결과물 열기</p>
      <h2 class="head">“완료했어요” 다음엔,<br><em>직접 열어보세요.</em></h2>
      <div class="process three">
        <div class="card step o1"><span class="num">01</span>${ic('folder')}<h3>AI-연습 폴더</h3><p>컴퓨터에서 열기</p></div>
        <div class="card step o2"><span class="num">02</span>${ic('file')}<h3>안내.html</h3><p>두 번 눌러 열기</p></div>
        <div class="card step em o3"><span class="num">03</span>${ic('browser')}<h3>브라우저</h3><p>글씨·내용 확인</p></div>
      </div>
      <p class="bottom-line">파일이 안 보이면, <strong>“저장한 위치를 알려 줘.”<span class="mark"></span></strong></p>
      <div class="browser popup-page"><div class="browser-bar"><span class="dots3"><i></i><i></i><i></i></span><span>안내.html</span></div><div class="event"><div class="books"><i></i><i></i><i></i></div><h3>우리 동네 책모임</h3><p class="info">10월 10일 · 오후 2시</p><p class="info">동네 도서관 2층</p></div></div>`),
    play(S) {
      intro(S);
      const steps = S.qa('.step');
      FX.popIn(steps, S.b[0] + 50, { stagger: 200, ease: EASE.bouncy, dur: 640 });
      gapArrows(S, steps, S.b[0] + 400, 200);
      FX.focus(steps, [
        { i: 0, at: S.b[1] + 50, to: S.b[2] + 50 },
        { i: 1, at: S.b[2] + 50, to: S.b[3] + 50 },
        { i: 2, at: S.b[3] + 50, to: S.e[3] + 150 }
      ]);
      FX.wiggle(steps[0].querySelector('.icon'), S.b[1] + 400, { deg: 10 });
      const t = cursorClick(S, steps[1].querySelector('.icon'), S.b[2] + 400, { show: true, double: true });
      FX.pulse(steps[1].querySelector('.icon'), t, { scale: 1.25, sound: 'pop2', gain: 0.4 });
      FX.cursor.hide(Math.min(t + 700, S.b[3] - 100));
      const popup = S.q('.popup-page');
      S.el.appendChild(popup);
      const o3 = local(S, steps[2]);
      Object.assign(popup.style, { left: `${o3.x + o3.w - 250}px`, top: `${o3.y - 196}px`, transformOrigin: '70% 100%' });
      FX.popIn(popup, S.b[3] + 350, { ease: EASE.bouncy, dur: 700, from: 0.2, sound: 'pop2' });
      FX.drop(popup.querySelectorAll('.books i'), S.b[3] + 800, { stagger: 120, dy: -40, gain: 0.25 });
      FX.rise(S.q('.bottom-line'), S.b[4] - 50, { sound: 'pop', gain: 0.4 });
      FX.mark(S.q('.bottom-line .mark'), S.b[4] + 650);
      hop(S, S.b[4] + 300);
    }
  };

  SCENES.refine = {
    html: layout('guide', 'code', `
      <p class="eyebrow">실습 4 · 수정 부탁</p>
      <h2 class="head">마음에 안 들면,<br><em>한 가지씩 바꿔요.</em></h2>
      <div class="refine">
        <div class="card req">
          <div class="quote">“<span class="hl change">제목 글씨를 두 배로 키워 줘.<span class="mark"></span></span><br><span class="hl keep">날짜와 장소는 그대로 둬.<span class="mark"></span></span>”<i class="caret"></i></div>
          <div class="prefer"><span class="bad">${ic('x')} <s>‘더 예쁘게’</s></span><span class="good">✓ ‘제목을 두 배로’</span></div>
          <span class="btn show">바뀐 모습 보기 <span aria-hidden="true">→</span></span>
        </div>
        <div class="card preview">
          <div class="labels"><span class="pill l0">수정 전 · 학습용 예시</span><span class="pill lime l1">수정 후 · 학습용 예시</span></div>
          <div class="ptitle">우리 동네 책모임</div>
          <p class="info">10월 10일 · 오후 2시 <span class="keep-badge">그대로</span></p>
          <p class="info">동네 도서관 2층 <span class="keep-badge">그대로</span></p>
        </div>
      </div>
      <p class="note refresh">${ic('refresh')} 파일 수정 후 브라우저를 새로고침하면 바뀐 결과를 볼 수 있어요.</p>`),
    build(S) { FX.splitChars(S.q('.quote')); },
    play(S) {
      intro(S);
      FX.slide(S.q('.req'), S.b[0] - 50, { dx: -70, sound: 'pop', gain: 0.4 });
      FX.slide(S.q('.preview'), S.b[0] + 150, { dx: 70, sound: 'pop', gain: 0.4 });
      FX.fade(S.qa('.prefer span, .req .btn'), S.b[0] - 50, { dur: 1, from: 0, to: 0 });
      FX.type(S.q('.quote'), S.b[1] + 300, { cps: 20 });
      FX.mark(S.q('.hl.change .mark'), S.b[2] + 150);
      FX.mark(S.q('.hl.keep .mark'), S.b[2] + 800);
      FX.popIn(S.qa('.keep-badge'), S.b[2] + 900, { stagger: 180, from: 0.4, gain: 0.35 });
      const btn = S.q('.req .btn');
      add(btn, [{ opacity: 0 }, { opacity: 1 }], { at: S.b[2] + 1300, dur: 240, fill: 'forwards' });
      const t = cursorClick(S, btn, S.b[2] + 1700, { show: true });
      FX.pulse(btn, t - 120, { scale: 0.94, dur: 240 });
      add(S.q('.ptitle'), [{ fontSize: '28px' }, { fontSize: '56px' }], { at: t + 50, dur: 700, ease: EASE.spring });
      sfx('boing', t + 80, 0.35);
      FX.swap(S.qa('.labels .pill'), [0, t + 120]);
      FX.cursor.hide(t + 700);
      const prefer = S.qa('.prefer span');
      add(prefer[0], [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { at: S.b[3] + 200, dur: 420, ease: EASE.spring, fill: 'forwards' });
      sfx('pop', S.b[3] + 200, 0.35);
      add(prefer[1], [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }], { at: S.b[3] + 900, dur: 420, ease: EASE.spring, fill: 'forwards' });
      sfx('ding', S.b[3] + 950, 0.4);
      FX.wiggle(prefer[0], S.b[3] + 700, { deg: 5 });
      const note = S.q('.note.refresh');
      FX.rise(note, S.b[4] - 50);
      FX.spin(note.querySelector('.icon'), S.b[4] + 350, { dur: 800 });
      sfx('swish', S.b[4] + 350, 0.3);
      add(S.q('.preview'), [{ opacity: 1 }, { opacity: 0.4, offset: 0.35 }, { opacity: 1 }], { at: S.b[4] + 1100, dur: 520, ease: EASE.out, fill: 'none' });
      hop(S, S.b[4] + 1200, { h: 18 });
    }
  };

  SCENES.check = {
    html: layout('guide', 'review', `
      <p class="eyebrow">완료의 기준은 내가 정해요</p>
      <h2 class="head">보기 좋다면,<br><em>내용도 맞는지.</em></h2>
      <div class="verify">
        <div class="card vcard v1">${ic('calendar')}<strong>날짜·시간</strong><span class="q">10월 10일, 오후 2시?</span><span class="cc"><span class="check-dot">✓</span></span></div>
        <div class="card vcard v2">${ic('folder')}<strong>장소</strong><span class="q">동네 도서관 2층?</span><span class="cc"><span class="check-dot">✓</span></span></div>
        <div class="card vcard v3">${ic('eye')}<strong>읽기 편한가</strong><span class="q">글씨가 크고 잘 보이나?</span><span class="cc"><span class="check-dot">✓</span></span></div>
      </div>
      <div class="status"><p class="st0">확인한 항목 <strong class="count">0 / 3</strong></p><p class="st1">좋아요! 실제 결과물도 같은 기준으로 확인하세요. <strong>3 / 3</strong></p></div>
      <span class="caution">${ic('warn')} AI가 “검증했어요”라고 해도 날짜·이름은 틀릴 수 있어요</span>`),
    play(S) {
      intro(S);
      const cards = S.qa('.vcard');
      FX.popIn(cards, S.b[0] + 50, { stagger: 200, ease: EASE.bouncy, dur: 640 });
      FX.rise(S.q('.st0'), S.b[0] + 700);
      const times = [];
      let first = true;
      [1, 2, 3].forEach((k, i) => {
        const t = cursorClick(S, cards[i], S.b[k] + 250, { show: first, dx: 40, dy: 30 });
        first = false;
        times.push(t);
        select(cards[i], t - 100);
        add(cards[i].querySelector('.check-dot'), [{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'none' }], { at: t - 60, dur: 480, ease: EASE.bouncy });
        sfx('ding', t, 0.45);
        FX.pulse(S.q('.count'), t, { scale: 1.25 });
      });
      const count = S.q('.count');
      let last = '';
      tick(now => {
        const n = times.filter(t => now >= t - 60).length;
        const text = `${n} / 3`;
        if (text !== last) { count.textContent = text; last = text; }
      });
      FX.swap(S.qa('.status p'), [0, times[2] + 500]);
      const p = FX.pos(S.q('.status'));
      FX.confetti(p.x + 330, p.y + 16, times[2] + 550, { count: 26, spread: 0.8 });
      FX.cursor.hide(Math.min(times[2] + 900, S.b[4] - 100));
      const caution = S.q('.caution');
      FX.popIn(caution, S.b[4] + 50, { from: 0.5, ease: EASE.bouncy, dur: 620 });
      FX.wiggle(cards[0].querySelector('.icon'), S.b[4] + 450, { deg: 12 });
      FX.wiggle(caution.querySelector('.icon'), S.b[4] + 600, { deg: 12 });
      FX.pulse(S.q('.head em'), S.b[5] + 250, { scale: 1.08, sound: 'pop2', gain: 0.4 });
      hop(S, S.b[5] + 200);
    }
  };

  SCENES.boundaries = {
    html: layout('feature', 'shield', `
      <p class="eyebrow">AI가 실제로 일하니까</p>
      <h2 class="head">자료와 권한도,<br><em>내가 정해요.</em></h2>
      <div class="bounds">
        <article class="card bound d1"><div class="big-icon peach">${ic('folder')}<span class="dup">${ic('folder')}</span></div><h3>복사본으로</h3><p>연습 폴더에서 시작</p></article>
        <article class="card bound d2"><div class="big-icon lav">${LOCK}</div><h3>민감한 정보는 빼기</h3><p>비밀번호·개인정보 확인</p></article>
        <article class="card bound d3"><div class="big-icon lime">${ic('hand')}</div><h3>허용 전에 읽기</h3><p>삭제·설치·외부 공개</p></article>
      </div>
      <p class="bottom-line">모르는 실행 요청에는 <strong>“무엇을 하는지 설명해 줘.”<span class="mark"></span></strong></p>`),
    play(S) {
      intro(S);
      hop(S, S.b[0] + 300);
      const cards = S.qa('.bound');
      slots(S, cards, S.in + 950, [S.b[1] - 100, S.b[2] - 100, S.b[3] - 100]);
      [1, 2, 3].forEach((k, i) => FX.popIn(cards[i], S.b[k] - 100, { ease: EASE.bouncy, dur: 680 }));
      add(S.q('.dup'), [{ transform: 'none' }, { transform: 'translate(12px, -12px) rotate(8deg)' }], { at: S.b[1] + 550, dur: 520, ease: EASE.spring });
      sfx('swish', S.b[1] + 550, 0.35);
      add(S.q('.d2 .shackle'), [{ transform: 'translateY(-8px)' }, { transform: 'none' }], { at: S.b[2] + 650, dur: 420, ease: EASE.bouncy });
      sfx('lock', S.b[2] + 720, 0.5);
      add(S.q('.d3 .icon'), [{ transform: 'translateY(10px) rotate(-10deg)' }, { transform: 'translateY(-6px) rotate(4deg)', offset: 0.5 }, { transform: 'none' }], { at: S.b[3] + 550, dur: 560, ease: EASE.out });
      sfx('pop2', S.b[3] + 560, 0.4);
      FX.rise(S.q('.bottom-line'), S.b[4] - 50, { sound: 'pop', gain: 0.4 });
      FX.mark(S.q('.bottom-line .mark'), S.b[4] + 650);
      hop(S, S.b[4] + 900);
    }
  };

  SCENES.stuck = {
    html: layout('feature', 'question', `
      <p class="eyebrow">막혀도, 처음부터 다시 할 필요는 없어요</p>
      <h2 class="head">이렇게 <em>말을 이어가세요.</em></h2>
      <div class="help">
        <div class="help-row h1"><span class="hl-label">어려운 말</span><p>“쉬운 말로, 한 단계씩 알려 줘.”</p></div>
        <div class="help-row h2"><span class="hl-label">오류가 났을 때</span><p>“이 오류를 설명하고 고쳐 줘.”</p></div>
        <div class="help-row h3"><span class="hl-label">엉뚱한 작업</span><p><span class="stopkey">${ic('stop')} 중지</span> 후 “내 부탁을 다시 확인해 줘.”</p></div>
      </div>
      <span class="masked">${ic('warn')} 오류 화면 예시: <span class="who">홍길동<i></i></span> 님의 파일을 열 수 없어요</span>`),
    play(S) {
      intro(S);
      hop(S, S.b[0] + 300);
      const rows = S.qa('.help-row');
      [1, 2, 3].forEach((k, i) => FX.slide(rows[i], S.b[k] - 100, { dx: 80, sound: 'pop', gain: 0.4 }));
      FX.pulse(rows[0].querySelector('.hl-label'), S.b[1] + 500, { scale: 1.1 });
      add(rows[1], [{ translate: '0 0' }, { translate: '-5px 0', offset: 0.25 }, { translate: '5px 0', offset: 0.5 }, { translate: '-2px 0', offset: 0.75 }, { translate: '0 0' }], { at: S.b[2] + 600, dur: 380, ease: EASE.linear, fill: 'none' });
      const stop = S.q('.stopkey');
      FX.pulse(stop, S.b[3] + 700, { scale: 0.86, dur: 300, sound: 'click', gain: 0.5 });
      tint(stop, S.b[3] + 760, '#d9cf99');
      const masked = S.q('.masked');
      FX.popIn(masked, S.b[4] - 50, { from: 0.5, gain: 0.4 });
      add(S.q('.who i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { at: S.b[4] + 900, dur: 420, ease: EASE.out });
      sfx('marker', S.b[4] + 900, 0.45);
      hop(S, S.b[4] + 1300, { h: 16 });
    }
  };

  SCENES.transfer = {
    html: layout('corner', 'connect', `
      <p class="eyebrow">배운 방법은 다른 도구에서도</p>
      <h2 class="head">도구를 바꿔도,<br><em>부탁하는 원리는 같아요.</em></h2>
      <div class="transfer">
        <article class="card tcard t1"><div class="ttitle"><span class="sign ink">C↗</span><h3>Codex</h3></div><ol><li><b>1</b>앱·편집기에서 작업 폴더 선택</li><li><b>2</b>할 일을 말로 요청</li><li><b>3</b>변경 내용과 결과 확인</li></ol></article>
        <article class="card tcard t2"><div class="ttitle"><span class="sign clay">${ASTERISK}</span><h3>Claude Code</h3></div><ol><li><b>1</b>데스크톱 앱의 Code 열기</li><li><b>2</b>폴더 선택 후 할 일 요청</li><li><b>3</b>권한·수정 내용 확인</li></ol></article>
      </div>
      <div class="remember">기억할 것: <span class="chip">할 일</span><i>+</i><span class="chip">자료</span><i>+</i><span class="chip">원하는 결과</span><i>+</i><span class="chip last">확인</span></div>`),
    play(S) {
      intro(S);
      const cards = S.qa('.tcard');
      FX.popIn(cards, S.b[0] + 50, { stagger: 220, ease: EASE.bouncy, dur: 640 });
      S.qa('.sign').forEach((sign, i) => FX.spin(sign, S.b[0] + 400 + i * 220, { dur: 700 }));
      [1, 2].forEach((k, i) => {
        FX.slide(cards[i].querySelectorAll('li'), S.b[k] + 150, { dx: 40, stagger: 650, sound: 'tick', gain: 0.4 });
        FX.glow(cards[i], S.b[k] + 100, S.e[k] + 100);
      });
      const chips = [...S.qa('.remember .chip')];
      FX.fade(S.q('.remember'), S.b[3] - 150, { dur: 1, from: 0, to: 1 });
      FX.popIn(chips.slice(0, 3), S.b[3] + 150, { stagger: 420, from: 0.4, gain: 0.45 });
      FX.popIn(S.qa('.remember i'), S.b[3] + 400, { stagger: 420, from: 0.2, sound: null });
      FX.stamp(chips[3], S.b[3] + 1410, { rot: -4, sound: 'stamp', gain: 0.5, dur: 360 });
      hop(S, S.b[3] + 1900);
    }
  };

  SCENES.quiz = {
    html: layout('feature', 'question', `
      <p class="eyebrow">잠깐, 함께 골라볼까요?</p>
      <div class="qhead"><h2 class="head">‘결과물’을 부탁하는 말은?</h2><div class="timer"><svg viewBox="0 0 84 84" aria-hidden="true"><circle class="track" cx="42" cy="42" r="36"/><circle class="ring" cx="42" cy="42" r="36" pathLength="1"/></svg><span class="num">3</span></div></div>
      <div class="quiz">
        <div class="opt qa"><span class="letter">A</span><span>“모임 안내 페이지를<br>만드는 법을 알려 줘.”</span><span class="anote">방법을 묻는 말</span></div>
        <div class="opt qb"><span class="letter">B</span><span>“이 폴더에 안내 파일을 만들고,<br>내가 열어볼 방법을 알려 줘.”</span><span class="stamp">정답!</span></div>
      </div>
      <div class="qfeedback"><p>만들 파일과 내가 확인할 방법을 함께 부탁했어요.</p></div>`),
    play(S) {
      intro(S);
      hop(S, S.b[0] + 300);
      const opts = S.qa('.opt');
      FX.popIn(opts, S.b[1] + 100, { stagger: 380, from: 0.5, ease: EASE.bouncy, dur: 660 });
      S.qa('.letter').forEach((letter, i) => FX.spin(letter, S.b[1] + 300 + i * 380, { dur: 600 }));
      const timer = S.q('.timer');
      const start = S.b[2] + 350;
      FX.popIn(timer, S.b[2] + 50, { from: 0.3, ease: EASE.bouncy, dur: 560 });
      add(timer.querySelector('.ring'), [{ strokeDashoffset: 0 }, { strokeDashoffset: 1 }], { at: start, dur: 3000, ease: EASE.linear });
      const num = timer.querySelector('.num');
      let last = '';
      tick(t => {
        const left = t < start ? 3 : Math.max(1, 3 - Math.floor((t - start) / 1000));
        const text = String(left);
        if (text !== last) { num.textContent = text; last = text; }
      });
      [0, 1000, 2000].forEach(d => { sfx('tick', start + d, 0.55); FX.pulse(num, start + d, { scale: 1.3, dur: 360 }); });
      FX.pulse(opts[0], start + 400, { scale: 1.025, dur: 900 });
      FX.pulse(opts[1], start + 1400, { scale: 1.025, dur: 900 });
      add(timer, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.6)' }], { at: S.b[3] - 200, dur: 260, ease: EASE.in });
      const t = cursorClick(S, opts[1], S.b[3] + 100, { show: true, dx: 120 });
      select(opts[1], t - 100);
      FX.stamp(opts[1].querySelector('.stamp'), t + 100, { rot: -8, sound: 'success', gain: 0.55 });
      const p = FX.pos(opts[1]);
      FX.confetti(p.x + p.w - 60, p.y + 10, t + 200, { count: 30, spread: 0.9 });
      FX.focus(opts, [{ i: 1, at: t + 300, to: S.b[4] + 100 }]);
      FX.rise(S.q('.qfeedback p'), t + 500);
      FX.cursor.hide(t + 900);
      FX.stamp(opts[0].querySelector('.anote'), S.b[4] + 400, { rot: 3, sound: 'pop', gain: 0.4 });
      FX.wiggle(opts[0].querySelector('.letter'), S.b[4] + 700);
      hop(S, t + 250);
    }
  };

  SCENES.finish = {
    html: layout('feature', 'celebrate', `
      <p class="eyebrow">오늘, AI와 만든 첫 결과물</p>
      <h2 class="head l">말로 부탁하고.<br><em>눈으로 확인하세요.</em></h2>
      <div class="closing-flow"><span class="cf">부탁</span><i>→</i><span class="cf">계획</span><i>→</i><span class="cf">작업</span><i>→</i><span class="cf last">확인</span></div>
      <p class="lead">다음에는, 내가 만들고 싶은 것 하나.</p>`),
    play(S) {
      intro(S);
      FX.sparkles(S.q('.jw'), S.in + 800, S.t1, [[28, 40, 30, 0], [270, 30, 24, 450], [290, 230, 20, 900], [10, 250, 22, 1300]]);
      const j = FX.pos(S.q('.jw'));
      FX.confetti(j.cx, j.y + 60, S.b[0] + 300, { count: 40, spread: 1.1 });
      hop(S, S.b[0] + 250, { h: 34 });
      FX.pulse(S.q('.head em'), S.b[1] + 300, { scale: 1.08, sound: 'pop2', gain: 0.45 });
      const flow = S.qa('.closing-flow .cf');
      FX.fade(S.q('.closing-flow'), S.b[2] - 100, { dur: 1 });
      FX.popIn(flow, S.b[2] + 100, { stagger: 480, from: 0.4, gain: 0.45 });
      FX.popIn(S.qa('.closing-flow i'), S.b[2] + 350, { stagger: 480, from: 0.2, sound: null });
      FX.pulse(flow[3], S.b[2] + 1900, { scale: 1.18, sound: 'success', gain: 0.45 });
      FX.rise(S.q('.lead'), S.b[3] + 50, { sound: 'pop', gain: 0.35 });
      hop(S, S.b[3] + 500, { h: 22 });
    }
  };

  SCENES.resources = {
    html: layout('guide', 'study', `
      <p class="eyebrow">필요할 때 다시 꺼내 보세요</p>
      <h2 class="head">오늘의 실습, <em>여기에.</em></h2>
      <div class="card addr">${ic('globe')}<span class="url"><span class="typed">dkdlqoddi.github.io</span><i class="caret"></i></span><span class="pill">발표 기록 › AI, 한 걸음 더</span></div>
      <div class="res-grid">
        <div class="tiles"><div class="tile">${ic('chat')} 첫 부탁 문장</div><div class="tile">${ic('file')} 완성 예시 파일</div><div class="tile">${ic('print')} 인쇄용 PDF</div></div>
        <div class="card official"><h3>공식 사용 안내</h3><p><i>↗</i> Antigravity 시작하기</p><p><i>↗</i> 계획 검토와 승인</p><p><i>↗</i> Codex 시작하기</p><p><i>↗</i> Claude Code 시작하기</p></div>
      </div>
      <p class="note basis">공식 문서 확인: 2026. 09. 20. · 화면 모형은 학습용입니다. 버전에 따라 메뉴가 달라질 수 있어요.</p>`),
    build(S) { FX.splitChars(S.q('.addr .typed')); },
    play(S) {
      intro(S);
      const addr = S.q('.addr');
      FX.popIn(addr, S.b[0] - 100, { ease: EASE.spring, dur: 600, from: 0.7 });
      FX.type(S.q('.addr .url'), S.b[0] + 400, { cps: 14 });
      FX.slide(addr.querySelector('.pill'), S.b[0] + 2000, { dx: 40, sound: 'pop', gain: 0.35 });
      FX.popIn(S.qa('.tile'), S.b[1] + 100, { stagger: 320, from: 0.5, gain: 0.4 });
      const official = S.q('.official');
      FX.slide(official, S.b[2] - 50, { dx: 70, sound: 'swish' });
      FX.rise(official.querySelectorAll('p'), S.b[2] + 350, { stagger: 260, dy: 16 });
      FX.rise(S.q('.basis'), S.b[3] - 50, { sound: 'pop', gain: 0.3 });
      FX.glow(S.q('.addr'), S.b[3] + 300, S.e[3]);
      hop(S, S.b[4] + 150, { h: 30 });
      const j = FX.pos(S.q('.jw'));
      FX.confetti(j.cx, j.y + 40, S.b[4] + 250, { count: 36, spread: 1 });
    }
  };

  // Chapter title card; S.t0..S.t1 is the full-cover hold.
  const CHAPTERS = ['01 이해하기', '02 준비하기', '03 함께 만들기', '04 내 것으로 만들기'];
  const CARD = {
    html: card => `
      <div class="cc-dots"></div>
      <div class="cc-inner"><div class="cc-num">${card.num}</div><h2 class="cc-title">${card.title}</h2><p>${card.sub}</p></div>
      <div class="cc-steps">${CHAPTERS.map(name => `<span class="${name.startsWith(card.num) ? 'on' : ''}">${name}</span>`).join('')}</div>
      ${jw(card.pose)}`,
    play(S) {
      const el = S.el;
      add(el, [{ transform: 'translateY(760px)' }, { transform: 'none' }], { at: S.t0 - 460, dur: 460, ease: EASE.out });
      sfx('whoosh', S.t0 - 460, 0.5, -0.2);
      add(el, [{ transform: 'none' }, { transform: 'translateY(-760px)' }], { at: S.t1 - 440, dur: 440, ease: EASE.in });
      sfx('whoosh', S.t1 - 440, 0.45, 0.2);
      FX.popIn(el.querySelector('.cc-num'), S.t0 - 120, { from: 0.2, ease: EASE.bouncy, dur: 700, sound: 'chime', gain: 0.55 });
      add(el.querySelector('.cc-num'), [{ rotate: '-14deg' }, { rotate: '-4deg' }], { at: S.t0 - 120, dur: 700, ease: EASE.spring });
      FX.rise(el.querySelector('.cc-title'), S.t0 + 80, { dy: 40, dur: 520, ease: EASE.spring });
      FX.rise(el.querySelector('.cc-inner p'), S.t0 + 330);
      FX.popIn(el.querySelectorAll('.cc-steps span'), S.t0 + 200, { stagger: 70, from: 0.6, sound: null });
      FX.pulse(el.querySelector('.cc-steps .on'), S.t0 + 900, { scale: 1.12 });
      const j = el.querySelector('.jw');
      add(j, [{ opacity: 0, transform: 'translateY(160px) rotate(10deg)' }, { opacity: 1, transform: 'none', offset: 0.3 }, { opacity: 1, transform: 'none' }], { at: S.t0, dur: 760, ease: EASE.bouncy });
      FX.hop(j.querySelector('.jw-img'), S.t0 + 1100, { h: 30 });
      FX.bob(j.querySelector('.jw-float'), S.t0 + 760, S.t1, { amp: 6, period: 2400 });
      add(el.querySelector('.cc-dots'), [{ transform: 'translate(0, 0)' }, { transform: 'translate(-56px, -28px)' }], { at: S.t0 - 460, dur: S.t1 - S.t0 + 460, ease: EASE.linear });
    }
  };

  window.VIDEO_SCENES = SCENES;
  window.VIDEO_CARD = CARD;
})();
