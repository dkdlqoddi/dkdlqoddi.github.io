/* Exercises specific to AI, 한 걸음 더; navigation lives in deck-template.js. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const notify = message => window.DeckTemplate.notify(message);
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

})();
