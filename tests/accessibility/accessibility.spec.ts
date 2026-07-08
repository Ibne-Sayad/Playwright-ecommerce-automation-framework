import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page, type TestInfo } from '@playwright/test';
import '../hooks';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { neutralizeAds } from '../../utils/neutralize-ads';

type AxeViolations = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

const knownCriticalViolations: Record<string, Record<string, string[]>> = {
  'home-page': {
    'button-name': ['#subscribe']
  },
  'products-page': {
    'button-name': ['#submit_search', '#subscribe']
  }
};

async function attachAccessibilityReport(testInfo: TestInfo, pageName: string, violations: AxeViolations) {
  const report = violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary
    }))
  }));

  await testInfo.attach(`${pageName}-accessibility-report.json`, {
    body: JSON.stringify(report, null, 2),
    contentType: 'application/json'
  });
}

function isKnownCriticalViolation(pageName: string, violation: AxeViolations[number]) {
  const knownTargets = knownCriticalViolations[pageName]?.[violation.id] || [];

  return violation.nodes.every((node) => node.target.some((target) => knownTargets.includes(String(target))));
}

async function scanPage(pageName: string, page: Page, testInfo: TestInfo) {
  await neutralizeAds(page);

  const results = await new AxeBuilder({ page })
    .exclude('iframe')
    .exclude('ins.adsbygoogle')
    .analyze();

  await attachAccessibilityReport(testInfo, pageName, results.violations);

  const unexpectedCriticalViolations = results.violations.filter(
    (violation) => violation.impact === 'critical' && !isKnownCriticalViolation(pageName, violation)
  );

  expect(unexpectedCriticalViolations, `${pageName} should not have unexpected critical accessibility violations`).toEqual([]);
}

test.describe('Accessibility checks @a11y', () => {
  test('home page has no critical accessibility violations @a11y @sanity', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.expectLoaded();

    await scanPage('home-page', page, testInfo);
  });

  test('products page has no critical accessibility violations @a11y @regression', async ({ page }, testInfo) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.openProducts();
    await productsPage.searchInput.waitFor({ state: 'visible' });

    await scanPage('products-page', page, testInfo);
  });
});
