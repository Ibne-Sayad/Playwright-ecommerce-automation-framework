import { test, expect } from '@playwright/test';
import './hooks';
import { HomePage } from '../pages/HomePage';
import { neutralizeAds } from '../utils/neutralize-ads';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';

test.describe('Cart flow', () => {
  test('adds a product to the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openProducts();
    await productsPage.addFirstProductToCart();

    await expect(page.getByRole('link', { name: 'View Cart' })).toBeVisible();
  });

  test('removes a product from the cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openProducts();
    await productsPage.addFirstProductToCart();
    await page.goto('/view_cart');
    await cartPage.removeFirstItem();

    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
