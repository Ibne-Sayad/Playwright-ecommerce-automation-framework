import { Page, Locator } from '@playwright/test';
import { neutralizeAds } from '../utils/neutralize-ads';

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly firstProduct: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input#search_product');
    this.searchButton = page.locator('button#submit_search');
    this.productCards = page.locator('.product-image-wrapper');
    this.firstProduct = page.locator('.product-image-wrapper').first();
    this.addToCartButton = page.locator('.productinfo a[data-product-id]').first();
    this.viewCartLink = page.locator('.modal-content a[href="/view_cart"]');
  }

  async searchProduct(term: string) {
    await neutralizeAds(this.page);
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async openFirstProductDetails() {
    await neutralizeAds(this.page);
    const link = this.firstProduct.locator('a[href^="/product_details/"]').first();
    const href = await link.getAttribute('href');
    await link.waitFor({ state: 'visible' });
    try {
      await link.click();
    } catch (e) {
      // fallback to DOM click if overlay intercepts pointer events
      const handle = await link.elementHandle();
      if (handle) {
        await this.page.evaluate((el) => (el as HTMLElement).click(), handle);
      } else {
        throw e;
      }
    }
    await this.page.waitForURL(/\/product_details\/\d+/, { timeout: 10_000 }).catch(async () => {
      if (!href) throw new Error('Product details link is missing href');
      await this.page.goto(href);
    });
  }

  async addFirstProductToCart() {
    await neutralizeAds(this.page);
    try {
      await this.addToCartButton.click();
    } catch (e) {
      try {
        await this.addToCartButton.click({ force: true });
      } catch (e2) {
        // final fallback: DOM click
        const handle = await this.addToCartButton.elementHandle();
        if (handle) {
          await this.page.evaluate((el) => (el as HTMLElement).click(), handle);
        } else {
          throw e2;
        }
      }
    }
    await this.viewCartLink.waitFor({ state: 'visible' });
  }
}
