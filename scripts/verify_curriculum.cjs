/* Course paths and backwards-compatible links, independently of visual checks. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'slides.json')));
const previous = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/previous-slide-ids.json')));
const handouts = ['slides/notebooklm-examples/practice.html', 'slides/agent-tools-antigravity/preparation.html',
  'slides/agent-tools-antigravity/practice-result.html', 'slides/ai-agent-skills-philosophy/reference.html',
  'slides/shared/labs/sw.html', 'slides/shared/labs/eda.html'];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let checked = 0;
    for (const item of manifest) {
      const url = `${base}/slides/${item.dir}/`;
      await page.goto(url);
      await page.waitForFunction(() => Reveal.isReady());
      assert.equal(await page.evaluate(() => Reveal.getIndices().h), 0, `${item.module}: cover`);
      const data = await page.evaluate(() => ({
        old: (document.body.dataset.previousOrder || '').split(/\s+/).filter(Boolean),
        slides: [...document.querySelectorAll('.slides > section')].map(s => ({ id: s.id, aliases: (s.dataset.previousIds || '').split(/\s+/).filter(Boolean) })),
        links: [...document.querySelectorAll('.slides a[href]')].map(a => a.getAttribute('href'))
      }));
      assert.equal(data.slides.length, item.slideCount);
      const ids = data.slides.map(s => s.id);
      const named = new Map(data.slides.flatMap(s => [s.id, ...s.aliases].map(id => [id, s.id])));
      if (previous[item.dir]) {
        assert.equal(data.old.length, previous[item.dir].length, `${item.module}: complete old numeric map`);
        for (const id of previous[item.dir]) assert(named.has(id), `${item.module}: lost previous ID ${id}`);
      }
      for (const next of item.next) assert(data.links.includes(`../${next}/`), `${item.module}: missing next path ${next}`);
      assert(data.links.includes(item.pdf), `${item.module}: downloadable PDF`);
      assert(data.links.includes(`../../#${item.track}`), `${item.module}: return to track`);
      const routes = [...named, ...data.old.map((id, n) => [String(n), id])];
      for (const [input, expected] of routes) {
        await page.evaluate(input => { location.hash = '#/' + input; }, input);
        await page.waitForFunction(expected => Reveal.getCurrentSlide().id === expected && location.hash === '#/' + expected, expected);
        checked++;
      }
      // Cold-load numeric links, reading mode and file:// all use the same map.
      if (data.old.length) {
        const index = Math.floor(data.old.length / 2), expected = data.old[index];
        await page.goto('about:blank');
        await page.goto(url + '#/' + index);
        await page.waitForFunction(expected => Reveal.isReady() && Reveal.getCurrentSlide().id === expected, expected);
        await page.goto(url + '?view=read#/' + index);
        await page.waitForFunction(expected => location.hash === '#/' + expected && document.querySelector('#contents-list button[aria-current]'), expected);
        assert.equal(await page.locator('#contents-list button[aria-current]').locator('span').textContent(), String(ids.indexOf(expected) + 1).padStart(2, '0'));
        const alias = routes.find(([input, target]) => input !== target && !/^\d+$/.test(input));
        if (alias) {
          await page.evaluate(input => { location.hash = '#/' + input; }, alias[0]);
          await page.waitForFunction(expected => location.hash === '#/' + expected, alias[1]);
          const file = pathToFileURL(path.join(root, 'slides', item.dir, 'index.html')).href;
          await page.goto(file + '#/' + alias[0]);
          await page.waitForFunction(expected => Reveal.isReady() && Reveal.getCurrentSlide().id === expected, alias[1]);
        }
      }
      console.log(`PASS ${item.module}: ${routes.length} current/retired/numeric routes and next-module links`);
    }
    // Every local learner link must resolve, including PDFs and source files.
    const targets = new Set();
    for (const route of ['index.html', ...manifest.map(i => `slides/${i.dir}/index.html`), ...handouts]) {
      await page.goto(`${base}/${route}`);
      const links = await page.locator('a[href]').evaluateAll(as => as.map(a => a.href));
      for (const link of links) {
        const url = new URL(link);
        if (url.origin !== new URL(base).origin) continue;
        const target = path.join(root, decodeURIComponent(url.pathname));
        assert(fs.existsSync(target), `${route}: missing local link ${url.pathname}`);
        targets.add(target);
      }
    }
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
    await noJS.goto(base);
    for (const track of ['novice', 'expert']) {
      assert.deepEqual(await noJS.locator(`#${track} .card-index`).allTextContents(), manifest.filter(i => i.track === track).map(i => i.module));
    }
    for (const route of handouts) {
      await noJS.goto(`${base}/${route}`);
      assert(await noJS.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: mobile handout overflow`);
      assert(await noJS.locator('h1').isVisible(), `${route}: no-JS handout`);
    }
    for (const item of manifest) {
      await noJS.goto(`${base}/slides/${item.dir}/`);
      assert.equal(await noJS.locator('.slides > section:visible').count(), item.slideCount, `${item.module}: no-JS complete content`);
    }
    // The old video stays reproducible even though N3 has been reorganized.
    await page.goto(`${base}/video/agent-tools-antigravity/?render`);
    const info = await page.evaluate(() => window.VIDEO.ready);
    const pinned = JSON.parse(fs.readFileSync(path.join(root, 'video/agent-tools-antigravity/source-slides.json')));
    assert.deepEqual(info.scenes.map(s => s.id), pinned.sectionIds);
    assert(info.animations > 500);
    assert.equal(await page.locator('#player a').getAttribute('href'), pinned.currentCourse);
    assert.deepEqual(errors, []);
    console.log(`PASS curriculum: ${checked} routes, ${targets.size} local targets, two static tracks, six mobile/no-JS handouts, 122 no-JS slides, pinned 22-scene video.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
