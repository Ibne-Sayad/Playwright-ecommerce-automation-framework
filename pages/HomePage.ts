import { Page, Locator } from '@playwright/test';
import { neutralizeAds } from '../utils/neutralize-ads';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly contactLink: Locator;
  readonly loggedInAs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = page.getByRole('link', { name: /Signup \/ Login/i });
    this.productsLink = page.getByRole('link', { name: /Products/i });
    this.cartLink = page.getByRole('link', { name: /Cart/i });
    this.contactLink = page.getByRole('link', { name: /Contact us/i });
    this.loggedInAs = page.getByRole('link', { name: /Logout/i });
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.dismissConsentBanner();
  }

  async dismissConsentBanner() {
    await neutralizeAds(this.page);
  }

  async openSignupLogin() {
    await this.dismissConsentBanner();
    if (await this.loggedInAs.isVisible().catch(() => false)) {
      await this.loggedInAs.click();
      await this.dismissConsentBanner();
    }
    await this.signupLoginLink.waitFor({ state: 'visible' });
    await this.signupLoginLink.click();
  }

  async openProducts() {
    await this.dismissConsentBanner();
    await this.productsLink.waitFor({ state: 'visible' });
    await this.productsLink.click({ noWaitAfter: true });
    await this.page.waitForURL(/\/products/, { timeout: 10_000 }).catch(async () => {
      await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
    });
    await this.dismissConsentBanner();
  }

  async openCart() {
    await this.dismissConsentBanner();
    await this.cartLink.click({ noWaitAfter: true });
  }

  async openContact() {
    await this.dismissConsentBanner();
    await this.contactLink.waitFor({ state: 'visible' });
    await this.contactLink.click({ noWaitAfter: true });
  }

  async expectLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByText('Features Items').waitFor({ state: 'visible' });
  }
}
