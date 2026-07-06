import { test, expect } from '@playwright/test';
import './hooks';
import { HomePage } from '../pages/HomePage';
import { neutralizeAds } from '../utils/neutralize-ads';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Product catalog', () => {
  test('searches for a product', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openProducts();
    await productsPage.searchProduct('Blue Top');

    await expect(productsPage.productCards).toHaveCount(1);
  });

  test('opens product details from the catalog', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openProducts();
    await productsPage.openFirstProductDetails();

    await expect(page).toHaveURL(/\/products|\/product_details\/\d+/);
  });
});
