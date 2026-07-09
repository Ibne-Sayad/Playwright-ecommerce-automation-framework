import { Page, Locator } from '@playwright/test';
import { neutralizeAds } from '../utils/neutralize-ads';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly removeButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('tbody tr');
    this.removeButton = page.locator('a.cart_quantity_delete').first();
    this.emptyCartMessage = page.locator('b:has-text("Cart is empty!")');
  }

  async removeFirstItem() {
    await neutralizeAds(this.page);
    await this.removeButton.click({ force: true });
  }
}
