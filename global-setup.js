const { chromium } = require('@playwright/test');

module.exports = async () => {
  const baseURL = process.env.BASE_URL || 'https://automationexercise.com';
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (/googlesyndication|googleadservices|doubleclick|adservice|adsystem|google-analytics|googletagmanager|pagead/i.test(url)) {
        await route.abort();
        return;
      }
      await route.continue();
    });

    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);

    // Try clicking visible consent buttons
    try {
      const consentButtons = await page.$$('button');
      for (const btn of consentButtons) {
        const txt = (await btn.textContent()) || '';
        const aria = (await btn.getAttribute('aria-label')) || '';
        if (/accept all|confirm choices|consent|accept/i.test(txt + ' ' + aria)) {
          try { await btn.click({ timeout: 2000 }); break; } catch (e) {}
        }
      }
    } catch (e) {}

    // Ensure overlay removal as fallback
    await page.evaluate(() => {
      document.querySelectorAll('[id*="cookie"], [class*="cookie"], [class*="consent"], [class*="fc-"], #onetrust-banner-sdk, .qc-cmp2-container').forEach(el => el.remove());
    }).catch(() => {});

    // Extra defensive cleanup: hide/remove common overlays and ad iframes and set consent flags in localStorage
    await page.evaluate(() => {
      try {
        const selectors = [
          '.fc-consent-root', '.fc-dialog-overlay', '.fc-dialog', '.fc-spotlight',
          '#onetrust-banner-sdk', '.qc-cmp2-container', 'iframe[src*="ads"]', 'iframe[id^="aswift"]',
          'ins.adsbygoogle', '.adsbygoogle'
        ];
        selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => {
          try { el.remove(); } catch(e) { try { if (el && el.style) { el.style.pointerEvents = 'none'; el.style.visibility = 'hidden'; } } catch(e){} }
        }));

        // mark common localStorage flags to indicate consent
        try { localStorage.setItem('cookieconsent_status', 'dismiss'); } catch(e){}
        try { localStorage.setItem('consent', 'true'); } catch(e){}
        try { localStorage.setItem('euconsent', 'true'); } catch(e){}
      } catch(e) {}
    }).catch(() => {});

    // Give the page a moment to settle
    await page.waitForTimeout(800);

    // Also add a cookie indicating consent (defensive)
    try {
      await context.addCookies([
        { name: 'cookie_consent', value: '1', domain: 'automationexercise.com', path: '/' },
        { name: 'cookie_consent', value: '1', domain: '.automationexercise.com', path: '/' }
      ]);
    } catch (e) {}

    await context.storageState({ path: 'storageState.json' });
  } finally {
    await browser.close();
  }
};
