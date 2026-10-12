/* Chalk writing's lifecycle and old Step 02 links, beyond the shared shell suite. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const artifacts = process.env.ARTIFACT_DIR || '/tmp/presentation-chalk-check';
fs.mkdirSync(artifacts, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const slugs = JSON.parse(fs.readFileSync(path.join(root, 'slides.json'))).map(d => d.dir).concat('sample');
    for (const slug of slugs) {
      await page.goto(`${base}/slides/${slug}/`);
      await page.waitForFunction(() => Reveal.isReady() && window.ChalkMotion);
      await page.evaluate(() => document.fonts.ready);
      assert.match(await page.locator('.slides > section').first().locator('h1,h2').first().evaluate(el => getComputedStyle(el).fontFamily), /Pretendard/);
      await page.locator('[data-chalk-replay]').click();
      assert(await page.evaluate(() => Reveal.getCurrentSlide().getAnimations({ subtree: true }).length > 0), `${slug}: live board writing`);
      await page.locator('[data-chalk-finish]').click();
      assert(await page.evaluate(() => [...document.querySelectorAll('.chalk-step')].every(el => getComputedStyle(el).clipPath === 'none')), `${slug}: complete view`);
    }
    const url = `${base}/slides/llm-agent-basics/`;
    await page.goto(url + '#/agent-loop');
    await page.waitForFunction(() => Reveal.isReady() && Reveal.getCurrentSlide().id === 'agent-loop');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('[data-chalk-replay]').click();
    await page.locator('[data-chalk-pause]').click();
    const components = await page.evaluate(() => {
      const board = Reveal.getCurrentSlide();
      const active = board.getAnimations({ subtree: true });
      const timing = selector => board.querySelector(selector).getAnimations()[0]?.effect.getTiming();
      return {
        frame: timing('.flow-node'), label: timing('.flow-node strong'), arrow: timing('[data-chalk-stroke]'),
        character: timing('.jelly-woo'),
        unique: new Set(active.map(a => a.effect.target)).size === active.length,
        end: Math.max(...active.map(a => a.effect.getTiming().delay + a.effect.getTiming().duration))
      };
    });
    assert(components.frame && components.label && components.arrow && components.character, 'Frames, labels, arrows and character must each animate');
    assert(components.frame.delay < components.label.delay && components.label.delay < components.arrow.delay, 'Flow nodes lead into their connecting arrow');
    assert(components.unique, 'Nested components must not animate the same element twice');
    assert(components.end <= 5000, 'More components must not delay a complete board beyond five seconds');
    const times = await page.evaluate(() => Reveal.getCurrentSlide().getAnimations({ subtree: true }).map(a => a.currentTime));
    await page.waitForTimeout(180);
    assert.deepEqual(await page.evaluate(() => Reveal.getCurrentSlide().getAnimations({ subtree: true }).map(a => a.currentTime)), times, 'Paused writing must not advance');
    await page.screenshot({ path: path.join(artifacts, 'paused-writing.png') });
    await page.locator('[data-chalk-pause]').click();
    await page.waitForFunction(() => Reveal.getCurrentSlide().getAnimations({ subtree: true }).every(a => a.playState !== 'paused'));
    await page.locator('[data-chalk-finish]').click();
    assert.equal(await page.evaluate(() => Reveal.getCurrentSlide().getAnimations({ subtree: true }).length), 0);
    await page.screenshot({ path: path.join(artifacts, 'agent-command.png') });
    // Resuming unfinished steps must not erase a heading already written.
    await page.locator('[data-chalk-replay]').click();
    await page.waitForTimeout(1100);
    await page.locator('[data-chalk-pause]').click();
    await page.locator('[data-chalk-pause]').click();
    await page.waitForTimeout(80);
    assert.equal(await page.locator('#agent-loop h2').evaluate(el => getComputedStyle(el).clipPath), 'none');
    // Following a new slide must cancel the old slide's pending writing.
    await page.locator('[data-chalk-replay]').click();
    await page.locator('#next').click();
    assert.equal(await page.locator('#agent-loop').evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert(await page.evaluate(() => [...document.querySelectorAll('.chalk-step')].every(el => getComputedStyle(el).clipPath === 'none')));
    assert.equal(await page.locator('.chalk-controls').isVisible(), false);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('[data-chalk-replay]').click();
    assert(await page.locator('#web-vs-agent tbody tr').evaluateAll(rows => rows.every(row => row.getAnimations().length === 1)), 'Comparison rows appear independently');
    // Print in the middle of a replay: all pages must contain the final board.
    await page.locator('[data-chalk-replay]').click();
    await page.evaluate(() => window.addEventListener('beforeprint', () => {
      window.printHasClippedChalk = [...document.querySelectorAll('.chalk-step')].some(el => getComputedStyle(el).clipPath !== 'none');
    }));
    const pdf = await page.pdf({ path: path.join(artifacts, 'mid-animation.pdf'), preferCSSPageSize: true, printBackground: true });
    const total = await page.locator('.slides > section').count();
    assert.equal((pdf.toString('latin1').match(/\/Type \/Page\b/g) || []).length, total);
    assert.equal(await page.evaluate(() => window.printHasClippedChalk), false);
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('printing')), false);
    const aliases = await page.evaluate(() => [...document.querySelectorAll('[data-previous-ids]')].flatMap(el => el.dataset.previousIds.split(' ').map(alias => [alias, el.id])));
    for (const [alias, id] of aliases) {
      await page.goto(url + '#/' + alias);
      await page.waitForFunction(id => Reveal.isReady() && Reveal.getCurrentSlide().id === id, id);
    }
    await page.goto(`${base}/slides/llm-agent-basics/#/agent-tools`);
    await page.waitForFunction(() => Reveal.isReady() && window.ChalkMotion);
    await page.locator('[data-chalk-replay]').click();
    assert(await page.locator('#agent-tools .board-card').evaluateAll(icons => icons.every(icon => icon.getAnimations().length === 1)), 'Product cards animate individually');
    await page.goto(`${base}/slides/sample/#/5`);
    await page.waitForFunction(() => Reveal.isReady() && window.ChalkMotion);
    await page.locator('[data-chalk-replay]').click();
    assert.equal(await page.locator('.fragment .chalk-step, .fragment.chalk-step, [data-auto-animate] svg .chalk-step').count(), 0, 'Reveal fragments and morphing diagrams retain their own animation');
    await page.goto(base);
    await page.waitForSelector('#cards .card');
    await page.locator('[data-chalk-replay]').click();
    assert(await page.locator('.galaxy-document').evaluate(el => el.getAnimations({ subtree: true }).length >= 4), 'Archive illustration details animate');
    await page.locator('[data-chalk-pause]').click();
    await page.locator('#cards .card').last().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('#cards .card:last-child .card-icon').getAnimations().length > 0);
    assert(await page.locator('#cards .card').last().evaluate(el => el.getAnimations({ subtree: true }).every(a => a.playState === 'paused')), 'Newly visible card details obey pause');
    await page.locator('[data-chalk-finish]').click();
    assert.equal(await page.locator('#cards').evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    await page.goto(pathToFileURL(path.join(root, 'slides/llm-agent-basics/index.html')).href);
    await page.waitForFunction(() => Reveal.isReady() && window.ChalkMotion);
    await page.locator('[data-chalk-finish]').click();
    assert.equal(await page.locator('.chalk-step').count() > 0, true);
    // Enter reading view before resizing; otherwise the shell's responsive
    // navigation can race a simultaneous page.goto from the offline page.
    await page.goto(url + '?view=read');
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url + '?view=read');
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Step 02 overflow at ${width}`);
      assert.equal(await page.locator('.chalk-controls').isVisible(), false);
      await page.locator('#agent-loop').screenshot({ path: path.join(artifacts, `agent-mobile-${width}.png`) });
    }
    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    await noJS.goto(url);
    assert.equal(await noJS.locator('section').count(), total);
    assert(await noJS.locator('#personal-agents').isVisible());
    assert(await noJS.locator('#agent-loop').isVisible());
    assert.deepEqual(errors, []);
    console.log(`PASS chalk writing: ${slugs.length} decks, Pretendard, component timing, table rows, icons, archive details, Reveal compatibility, pause/resume/finish, reduced motion, mid-animation PDF, ${aliases.length} old links, file://, mobile and no-JS.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
