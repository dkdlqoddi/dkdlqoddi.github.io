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
      assert.equal(await page.locator('.slides > section:visible').count(), total);
      await page.locator('#view-toggle').click();
      await page.waitForFunction(() => Reveal.isReady());
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), total - 1, 'Reading toggle must preserve location');
      await page.goto(url + '#/2');
      await page.waitForFunction(() => Reveal.isReady());
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 2, 'Old numeric links must still work');
      await page.screenshot({ path: path.join(artifacts, `${slug}-desktop.png`) });
      const pdf = await page.pdf({ path: path.join(artifacts, `${slug}.pdf`), preferCSSPageSize: true, printBackground: true });
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
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug}: mobile page overflow at ${width}`);
        assert(await page.evaluate(() => [...document.querySelectorAll('.course-nav button:not([hidden])')].filter(e => getComputedStyle(e).display !== 'none').every(e => e.getBoundingClientRect().right <= innerWidth + 1)), `${slug}: mobile controls overflow`);
      }
      await page.screenshot({ path: path.join(artifacts, `${slug}-mobile.png`) });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(pathToFileURL(path.join(root, 'slides', slug, 'index.html')).href);
      await page.waitForFunction(() => Reveal.isReady());
      await page.locator('#next').click();
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 1, 'Offline navigation failed');
      console.log(`PASS ${slug}: navigation, reading, mobile, file://, ${total}-page PDF`);
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
    assert.equal(await fallback.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(255, 255, 255)');
    await fallback.goto(pathToFileURL(path.join(root, '404.html')).href);
    assert.equal(await fallback.locator('.error-link').getAttribute('href'), './index.html');
    // Both old and new print URLs enter the shared print view without initializing Reveal.
    await fallback.addInitScript(() => { window.print = () => { window.printRequested = true; }; });
    for (const suffix of ['?view=print', '?print-pdf']) {
      await fallback.goto(`${base}/slides/sample/${suffix}`);
      await fallback.waitForFunction(() => window.printRequested);
      assert.equal(await fallback.locator('.slides > section:visible').count(), 8);
    }
    await fallback.close();
    const nojs = await browser.newPage({ javaScriptEnabled: false });
    await nojs.goto(base);
    assert(await nojs.locator('.fallback-links a').count() > 0);
    for (const slug of ['sample', 'agent-tools-antigravity']) {
      await nojs.goto(`${base}/slides/${slug}/`);
      assert(await nojs.locator('.slides > section:visible').count() > 1);
    }
    await nojs.close();
    console.log('PASS archive, motion preferences, course exercises, fragments, loading failures, deep 404 and no-JS reading.');
    console.log(`Artifacts: ${artifacts}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
