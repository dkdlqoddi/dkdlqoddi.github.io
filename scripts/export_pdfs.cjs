/* Regenerate the three PDFs already offered for download. */
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const base = process.env.SITE_URL || 'http://127.0.0.1:8000';
const decks = [
  ['agent-tools-antigravity', 'ai-tools-intro.pdf'],
  ['notebooklm-examples', 'notebooklm-examples.pdf'],
  ['ai-work-review', 'ai-work-review.pdf'],
];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    for (const [slug, filename] of decks) {
      await page.goto(`${base}/slides/${slug}/?view=read`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.querySelectorAll('img')].map(image => image.decode()));
        // Register after the shared print handler; PDF links must be portable.
        const links = [...document.querySelectorAll('.slides a[href]')].map(link => ({
          link,
          href: new URL(link.getAttribute('href'), `https://dkdlqoddi.github.io${location.pathname}`).href,
        }));
        window.addEventListener('beforeprint', () => links.forEach(({ link, href }) => link.setAttribute('href', href)));
      });
      const total = await page.locator('.slides > section').count();
      const target = path.join(root, 'slides', slug, filename);
      const pdf = await page.pdf({ path: target, preferCSSPageSize: true, printBackground: true });
      assert.equal((pdf.toString('latin1').match(/\/Type \/Page\b/g) || []).length, total, `${slug}: one slide per page`);
      console.log(`Saved ${path.relative(root, target)} (${total} pages)`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
