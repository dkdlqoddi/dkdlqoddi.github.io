/* Only lesson interactions; the shared DeckTemplate owns the presentation shell. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const notify = message => window.DeckTemplate.notify(message);
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = byId(button.dataset.copy);
      const text = target.innerText;
      try {
        if (location.protocol === 'file:' || !navigator.clipboard?.writeText) throw new Error('Use selection');
        await navigator.clipboard.writeText(text);
        notify('질문을 복사했어요. NotebookLM에 붙여넣으세요.');
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        notify('문장을 선택했어요. Ctrl+C 또는 Command+C로 복사하세요.');
      }
    });
  });
  const zones = {
    sources: '① 소스 — 답의 바탕이 될 자료를 선택하는 곳',
    chat: '② 채팅 — 자료에 대해 질문하고, 답의 근거를 확인하는 곳',
    studio: '③ Studio — 만든 오디오·마인드맵·퀴즈 등을 다시 보는 곳'
  };
  document.querySelectorAll('[data-zone]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-zone]').forEach(other => {
        other.classList.toggle('selected', other === button);
        other.setAttribute('aria-pressed', String(other === button));
      });
      byId('zone-explanation').textContent = zones[button.dataset.zone];
    });
  });
  byId('citation-toggle').addEventListener('click', () => {
    const open = byId('citation-source').classList.toggle('is-open');
    byId('citation-toggle').setAttribute('aria-expanded', String(open));
    if (open) notify('원문은 1인 8,000원이에요. 2인 비용과 비교해 보세요.');
  });
  const feedback = {
    aperture: '이 문제는 움직임 때문에 번진 상황이에요. 빛을 받는 시간을 살펴보세요.',
    shutter: '맞아요! 짧은 노출 시간으로 움직임이 번지는 것을 줄여요. 밝기도 함께 조절하세요.',
    iso: 'ISO만 낮추면 움직임의 번짐은 해결되지 않아요. 셔터 속도를 살펴보세요.'
  };
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-answer]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      byId('quiz-feedback').textContent = feedback[button.dataset.answer];
    });
  });
  document.querySelectorAll('.verify-card').forEach(button => {
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      const count = document.querySelectorAll('.verify-card[aria-pressed="true"]').length;
      byId('verification-status').replaceChildren(document.createTextNode(count === 3 ? '확인 완료! 다음에는 내 자료로 해보세요. ' : '확인한 항목을 눌러 보세요. '));
      const strong = document.createElement('strong');
      strong.textContent = `${count} / 3`;
      byId('verification-status').append(strong);
    });
  });
})();
