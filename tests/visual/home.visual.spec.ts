import { test, expect } from '@playwright/test';
import '../hooks';
import { HomePage } from '../../pages/HomePage';
import { ProductsPage } from '../../pages/ProductsPage';
import { neutralizeAds } from '../../utils/neutralize-ads';

test.describe('Visual regression @visual', () => {
  test('homepage category sidebar matches baseline @visual @sanity', async ({ page }) => {
    const homePage = new HomePage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.expectLoaded();

    await expect(page.locator('.category-products')).toHaveScreenshot('homepage-categories.png', {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.02
    });
  });

  test('products search area matches baseline @visual @regression', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await neutralizeAds(page);
    await page.goto('/products');
    await neutralizeAds(page);
    await productsPage.searchInput.waitFor({ state: 'visible' });

    await expect(productsPage.searchInput).toHaveScreenshot('products-search-input.png', {
      animations: 'disabled',
      caret: 'hide',
      mask: [page.locator('iframe'), page.locator('ins.adsbygoogle')],
      maxDiffPixelRatio: 0.05
    });
  });
});
