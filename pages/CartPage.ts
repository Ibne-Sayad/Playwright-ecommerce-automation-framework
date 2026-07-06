import { Page, Locator } from '@playwright/test';

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
    await this.removeButton.click();
  }
}
