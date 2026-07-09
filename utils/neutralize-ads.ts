import { Page } from '@playwright/test';

const blockedResourcePatterns = [
  /googlesyndication/i,
  /googleadservices/i,
  /doubleclick/i,
  /adservice/i,
  /adsystem/i,
  /google-analytics/i,
  /googletagmanager/i,
  /pagead/i
];

export function neutralizeAdsScript() {
  const selectors = [
    '.fc-dialog-overlay',
    '.fc-consent-root',
    '.fc-dialog',
    '.fc-spotlight',
    '#onetrust-banner-sdk',
    '.qc-cmp2-container',
    'iframe[src*="ads"]',
    'iframe[id^="aswift"]',
    'iframe[id*="google_ads"]',
    'iframe[name*="google_ads"]',
    'ins.adsbygoogle',
    '[id*="google_ads"]',
    '[id*="google_vignette"]',
    '[class*="adsbygoogle"]',
    '[class*="advertisement"]',
    '[class*="google-auto-placed"]',
    '[class*="google-vignette"]'
  ];

  const css = selectors
    .map((selector) => `${selector} { pointer-events: none !important; visibility: hidden !important; opacity: 0 !important; display: none !important; }`)
    .join('\n');

  const neutralize = (root: ParentNode = document) => {
    for (const selector of selectors) {
      root.querySelectorAll(selector).forEach((element) => {
        try {
          element.remove();
        } catch {
          const htmlElement = element as HTMLElement;
          htmlElement.style.pointerEvents = 'none';
          htmlElement.style.visibility = 'hidden';
          htmlElement.style.opacity = '0';
          htmlElement.style.display = 'none';
        }
      });
    }
  };

  const installStyle = () => {
    if (document.querySelector('style[data-playwright-ad-neutralizer]')) return;
    const style = document.createElement('style');
    style.setAttribute('data-playwright-ad-neutralizer', 'true');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  };

  installStyle();
  neutralize();

  if (window.location.hash === '#google_vignette') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  const observer = new MutationObserver((mutations) => {
    neutralize();
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          neutralize(node);
        }
      });
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
}

export async function blockNonEssentialResources(page: Page) {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();

    if (blockedResourcePatterns.some((pattern) => pattern.test(url))) {
      await route.abort();
      return;
    }

    await route.continue();
  });
}

export async function neutralizeAds(page: Page) {
  try {
    await page.evaluate(neutralizeAdsScript);
  } catch (e) {
    // ignore errors
  }
}
