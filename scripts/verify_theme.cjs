/* Browser regression suite. Install Playwright outside this static site; see README. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const artifacts = process.env.ARTIFACT_DIR || '/tmp/presentation-theme-check';
const slugs = JSON.parse(fs.readFileSync(path.join(root, 'slides.json'))).map(item => item.dir).concat('sample');
fs.mkdirSync(artifacts, { recursive: true });

// Check the rendered canvas rather than requiring a specific palette value.
async function checkComfortableCanvas(page, label) {
  const colors = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return { background: style.backgroundColor, text: style.color };
  });
  const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number)
    .map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const background = luminance(colors.background);
  const text = luminance(colors.text);
  assert(background < .75, `${label}: canvas must avoid near-white glare`);
  assert((Math.max(background, text) + .05) / (Math.min(background, text) + .05) >= 7, `${label}: body text contrast`);
}

async function checkCharacters(page, label) {
  await page.evaluate(() => Promise.all([...document.querySelectorAll('img.jelly-woo')].map(image => image.decode())));
  const failures = await page.evaluate(() => {
    const reading = document.body.classList.contains('reading');
    const printing = document.body.classList.contains('printing');
    const previous = !reading && !printing && Reveal.getIndices();
    const failures = [];
    for (const [index, slide] of [...document.querySelectorAll('.slides > section')].entries()) {
      if (previous) Reveal.slide(index, 0, 999);
      const images = slide.querySelectorAll('img.jelly-woo');
      if (images.length !== 1 || !images[0].complete || !images[0].naturalWidth) {
        failures.push(`${index + 1}: missing character`);
        continue;
      }
      const image = images[0];
      if (image.parentElement !== slide) failures.push(`${index + 1}: character must be a direct slide child`);
      const r = image.getBoundingClientRect();
      const s = slide.getBoundingClientRect();
      const layout = slide.dataset.jellyLayout;
      if (index === 0 && layout !== 'cover') failures.push('First slide must use the cover composition');
      const minima = { cover: 360, feature: 260, guide: 170, banner: 150, corner: 80 };
      const leftColumn = ['cover', 'feature', 'guide'].includes(layout);
      const center = (r.left + r.right) / 2;
      if (leftColumn ? center >= s.left + s.width / 2 : center <= s.left + s.width / 2) failures.push(`${index + 1}: ${layout} character is on the wrong side`);
      const slideStyle = getComputedStyle(slide);
      const canvasHeight = document.body.classList.contains('legacy-deck') ? 700 : 720;
      if (!reading && Math.abs(parseFloat(slideStyle.height) - canvasHeight) > 1) failures.push(`${index + 1}: character position must use the full slide canvas`);
      const scale = s.width / parseFloat(slideStyle.width);
      if (!leftColumn && r.top - s.top > (parseFloat(slideStyle.paddingTop) + 16) * scale + 2) failures.push(`${index + 1}: small character must stay at the top right`);
      const minimum = reading ? Math.min(minima[layout], s.width * .7) : minima[layout];
      if (!minimum || parseFloat(getComputedStyle(image).width) < minimum - 1) failures.push(`${index + 1}: ${layout} character is too small`);
      const main = slide.querySelector('.jelly-main');
      if (main && (main.scrollWidth > main.clientWidth + 2 || main.scrollHeight > main.clientHeight + 2)) failures.push(`${index + 1}: composed content overflow`);
      if (r.width < 40 || r.height < 40 || r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1) failures.push(`${index + 1}: character outside slide`);
      const overlaps = q => q.width && q.height && q.left < r.right - 2 && q.right > r.left + 2 && q.top < r.bottom - 2 && q.bottom > r.top + 2;
      const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim() || node.parentElement.closest('.notes,.visually-hidden,svg,[hidden]')) continue;
        const style = getComputedStyle(node.parentElement);
        if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        if ([...range.getClientRects()].some(overlaps)) failures.push(`${index + 1}: character overlaps ${node.textContent.trim().slice(0, 40)}`);
      }
      for (const diagram of slide.querySelectorAll('svg[role="img"]')) {
        if (overlaps(diagram.getBoundingClientRect())) failures.push(`${index + 1}: character overlaps diagram`);
      }
    }
    if (previous) Reveal.slide(previous.h, previous.v, previous.f);
    return failures;
  });
  assert.deepEqual(failures, [], `${label}: characters must load and leave content readable`);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const slug of slugs) {
      const url = `${base}/slides/${slug}/`;
      await page.goto(url);
      await page.waitForFunction(() => Reveal.isReady());
      const total = await page.locator('.slides > section').count();
      await page.evaluate(() => document.fonts.ready);
      await checkComfortableCanvas(page, slug);
      await checkCharacters(page, slug);
      const overflow = await page.evaluate(() => {
        const failures = [];
        Reveal.getSlides().forEach((slide, index) => {
          Reveal.slide(index, 0, -1);
          if (slide.scrollHeight > slide.clientHeight + 2 || slide.scrollWidth > slide.clientWidth + 2) failures.push(index + 1);
        });
        Reveal.slide(0, 0, -1);
        return failures;
      });
      assert.deepEqual(overflow, [], `${slug}: slide content overflow`);
      assert.equal(await page.locator('.topbar').count(), 1);
      assert.equal(await page.locator('#contents-list button').count(), total);
      await page.locator('#next').click();
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 1);
      await page.locator('#contents-open').click();
      const before = await page.evaluate(() => Reveal.getIndices().h);
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), before, 'Dialog must own keyboard input');
      await page.locator('#contents-list button').last().click();
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), total - 1);
      await page.locator('#view-toggle').click();
      await page.waitForFunction(() => document.body.classList.contains('reading'));
      await checkComfortableCanvas(page, `${slug}: reading`);
      await checkCharacters(page, `${slug}: reading`);
      assert.equal(await page.locator('.slides > section:visible').count(), total);
      await page.locator('#view-toggle').click();
      await page.waitForFunction(() => Reveal.isReady());
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), total - 1, 'Reading toggle must preserve location');
      await page.goto(url + '#/2');
      await page.waitForFunction(() => Reveal.isReady());
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 2, 'Old numeric links must still work');
      await page.screenshot({ path: path.join(artifacts, `${slug}-desktop.png`) });
      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
      await checkCharacters(page, `${slug}: print composition`);
      await page.emulateMedia({ media: null });
      await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      await page.evaluate(() => {
        window.printFitFailures = null;
        matchMedia('print').addEventListener('change', event => {
          if (!event.matches) return;
          window.printFitFailures = [...document.querySelectorAll('.print-content')].flatMap(frame => {
            const content = frame.getBoundingClientRect();
            const slide = frame.parentElement.getBoundingClientRect();
            return content.height > 651 || content.bottom > slide.bottom - 27
              ? [frame.parentElement.dataset.pageLabel] : [];
          });
        });
      });
      const pdf = await page.pdf({ path: path.join(artifacts, `${slug}.pdf`), preferCSSPageSize: true, printBackground: true });
      assert.deepEqual(await page.evaluate(() => window.printFitFailures), [], `${slug}: actual print media must fit content before pagination`);
      assert.equal((pdf.toString('latin1').match(/\/Type \/Page\b/g) || []).length, total, `${slug}: one slide per PDF page`);
      assert.equal(await page.locator('.print-content').count(), 0, 'Print must restore the DOM');
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 2, 'Print must preserve the active slide');
      for (const width of [320, 390]) {
        if (width === 320) {
          await Promise.all([page.waitForURL(/view=read/), page.setViewportSize({ width, height: 844 })]);
        } else await page.setViewportSize({ width, height: 844 });
        await page.goto(url);
        await page.waitForFunction(() => document.body.classList.contains('reading') && document.querySelector('#contents-list button'));
        assert.equal(await page.locator('.slides > section:visible').count(), total);
        await checkCharacters(page, `${slug}: mobile ${width}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug}: mobile page overflow at ${width}`);
        assert(await page.evaluate(() => [...document.querySelectorAll('.course-nav button:not([hidden])')].filter(e => getComputedStyle(e).display !== 'none').every(e => e.getBoundingClientRect().right <= innerWidth + 1)), `${slug}: mobile controls overflow`);
      }
      await page.screenshot({ path: path.join(artifacts, `${slug}-mobile.png`) });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(pathToFileURL(path.join(root, 'slides', slug, 'index.html')).href);
      await page.waitForFunction(() => Reveal.isReady());
      await checkCharacters(page, `${slug}: file://`);
      await page.locator('#next').click();
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 1, 'Offline navigation failed');
      console.log(`PASS ${slug}: characters, navigation, reading, mobile, file://, ${total}-page PDF`);
    }
    // Fragment navigation uses Reveal.next/prev, rather than skipping to the next slide.
    await page.goto(`${base}/slides/sample/`);
    await page.waitForFunction(() => Reveal.isReady());
    await page.evaluate(() => Reveal.slide(5, 0, -1));
    await page.locator('#next').click();
    assert.equal(await page.evaluate(() => Reveal.getIndices().h), 5);
    assert(await page.locator('.present .fragment.visible').count() > 0);

    // Course exercises remain independent of the shared shell.
    await page.goto(`${base}/slides/agent-tools-antigravity/?view=read`);
    await page.locator('#refine-demo').click();
    assert.equal(await page.locator('#refine-demo').getAttribute('aria-pressed'), 'true');
    for (const button of await page.locator('.verify-card').all()) await button.click();
    assert.match(await page.locator('#verification-status').innerText(), /3 \/ 3/);
    await page.locator('[data-answer="b"]').click();
    assert.match(await page.locator('#quiz-feedback').innerText(), /맞아요/);
    await page.locator('[data-zone="chat"]').click();
    assert.match(await page.locator('#zone-explanation').innerText(), /② 대화/);
    await page.locator('#approve-demo').click();
    assert.match(await page.locator('#approve-feedback').innerText(), /연습 완료/);
    await page.goto(pathToFileURL(path.join(root, 'slides/agent-tools-antigravity/index.html')).href + '?view=read');
    await page.locator('[data-copy]').first().click();
    assert.match(await page.locator('#notification').innerText(), /문장을 선택/);

    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base);
      await page.waitForSelector('.card');
      assert.equal(await page.locator('.card').count(), slugs.length - 1);
      assert.deepEqual(await page.locator('.card-title a').evaluateAll(links => links.map(link => link.getAttribute('href'))), slugs.slice(0, -1).map(slug => `slides/${slug}/`), 'Cards must follow curriculum order, not publication dates');
      assert.deepEqual(await page.locator('.card-index').allTextContents(), slugs.slice(0, -1).map((_, index) => `STEP ${String(index + 1).padStart(2, '0')}`));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Home overflow at ${width}`);
      assert.equal(await page.locator('#motion-toggle').isVisible(), false);
    }
    await page.screenshot({ path: path.join(artifacts, 'home-desktop.png'), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('#motion-toggle').click();
    assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'true');
    assert(await page.evaluate(() => getComputedStyle(document.querySelector('.orbit-outer')).animationPlayState === 'paused'));
    await page.locator('#motion-toggle').click();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.orbit-outer')).animationName), 'none');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(artifacts, 'home-mobile.png'), fullPage: true });
    assert.deepEqual(errors, []);

    // Failures and progressive enhancement must still expose useful content.
    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await fallback.route('**/slides.json', route => route.fulfill({ status: 503, body: '' }));
    await fallback.goto(base);
    await fallback.waitForSelector('.retry-button');
    assert(await fallback.locator('#status a').isVisible());
    assert.equal(await fallback.locator('#status a').getAttribute('href'), `slides/${slugs[0]}/`, 'Failure fallback must open the first learning resource');
    await fallback.unroute('**/slides.json');
    await fallback.route('**/slides.json', route => route.fulfill({ json: [] }));
    await fallback.goto(base);
    await fallback.waitForFunction(() => document.querySelector('#status').textContent.includes('아직'));
    await fallback.route('**/vendor/reveal.js/dist/reveal.js', route => route.abort());
    await fallback.goto(`${base}/slides/agent-tools-antigravity/`);
    assert.equal(await fallback.locator('.slides > section:visible').count(), 22);
    await fallback.route('**/missing/deep/page', route => route.fulfill({ contentType: 'text/html', body: fs.readFileSync(path.join(root, '404.html'), 'utf8') }));
    await fallback.goto(`${base}/missing/deep/page`);
    assert.equal(await fallback.locator('.topbar').count(), 1);
    assert.equal(await fallback.locator('.error-link').getAttribute('href'), '/');
    const standalone = path.join(artifacts, 'practice-result-standalone.html');
    fs.copyFileSync(path.join(root, 'slides/agent-tools-antigravity/practice-result.html'), standalone);
    await fallback.goto(pathToFileURL(standalone).href);
    assert(await fallback.locator('h1').isVisible());
    await checkComfortableCanvas(fallback, 'standalone practice');
    await fallback.goto(pathToFileURL(path.join(root, '404.html')).href);
    assert.equal(await fallback.locator('.error-link').getAttribute('href'), './index.html');
    // Both old and new print URLs enter the shared print view without initializing Reveal.
    await fallback.addInitScript(() => {
      window.print = () => {
        window.printRequested = true;
        window.charactersReadyAtPrint = [...document.querySelectorAll('img.jelly-woo')].every(image => image.complete && image.naturalWidth > 0);
      };
    });
    for (const suffix of ['?view=print', '?print-pdf']) {
      await fallback.goto(`${base}/slides/sample/${suffix}`);
      await fallback.waitForFunction(() => window.printRequested);
      assert.equal(await fallback.evaluate(() => window.charactersReadyAtPrint), true, 'Print must wait for character images');
      assert.equal(await fallback.locator('.slides > section:visible').count(), 8);
    }
    await fallback.route('**/jelly-woo/plan.webp', route => route.abort());
    await fallback.goto(`${base}/slides/sample/?view=print`);
    await fallback.waitForFunction(() => document.querySelector('#notification').textContent.includes('이미지를 불러오지 못했어요'));
    assert.equal(await fallback.evaluate(() => Boolean(window.printRequested)), false, 'Failed images must not silently produce an incomplete PDF');
    await fallback.close();
    const nojs = await browser.newPage({ javaScriptEnabled: false });
    await nojs.goto(base);
    assert.deepEqual(await nojs.locator('.fallback-links a').evaluateAll(links => links.map(link => link.getAttribute('href'))), slugs.slice(0, -1).map(slug => `slides/${slug}/`), 'No-JS links must preserve the complete curriculum order');
    for (const slug of ['sample', 'agent-tools-antigravity', 'ai-work-review']) {
      await nojs.goto(`${base}/slides/${slug}/`);
      assert(await nojs.locator('.slides > section:visible').count() > 1);
      assert.equal(await nojs.locator('img.jelly-woo').count(), await nojs.locator('.slides > section').count(), 'Characters must remain available without JS');
    }
    await nojs.close();
    console.log('PASS archive, motion preferences, course exercises, fragments, loading failures, deep 404 and no-JS reading.');
    console.log(`Artifacts: ${artifacts}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
