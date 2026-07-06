const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  async function inspect(url, selectorList) {
    console.log('---', url, '---');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    for (const sel of selectorList) {
      const els = await page.$$(sel);
      console.log(sel, els.length);
      for (let i = 0; i < Math.min(els.length, 10); i++) {
        const el = els[i];
        const text = (await el.textContent())?.trim().slice(0, 200) || '';
        const html = (await el.evaluate((node) => node.outerHTML)).slice(0, 400);
        console.log(`  [${i}]`, text.replace(/\s+/g, ' '));
        console.log(`      ${html}`);
      }
    }
  }

  await inspect('https://automationexercise.com/login', [
    'b', 'h2', 'h3', 'p', 'div', 'form', 'input', 'button', 'a', '#form', '.status.alert-success'
  ]);
  await inspect('https://automationexercise.com/contact_us', [
    'form', 'input', 'textarea', 'button', 'div.status.alert-success', '.status', '.alert'
  ]);
  await inspect('https://automationexercise.com/products', [
    'a[href="/view_cart"]', '.product-image-wrapper', 'div', 'button', 'a', 'input'
  ]);

  await browser.close();
})();
