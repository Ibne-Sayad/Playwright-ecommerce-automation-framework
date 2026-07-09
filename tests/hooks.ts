import { test } from '@playwright/test';
import { blockNonEssentialResources, neutralizeAds, neutralizeAdsScript } from '../utils/neutralize-ads';

test.beforeEach(async ({ page }) => {
  await blockNonEssentialResources(page);
  await page.addInitScript(neutralizeAdsScript);
  await neutralizeAds(page);
});
