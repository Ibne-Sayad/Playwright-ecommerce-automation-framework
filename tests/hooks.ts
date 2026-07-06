import { test } from '@playwright/test';
import { neutralizeAds, neutralizeAdsScript } from '../utils/neutralize-ads';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(neutralizeAdsScript);
  await neutralizeAds(page);
});
