import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.errorMessage = page.locator('p[style="color: red;"]');
  }

  async register(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async completeSignup(password: string) {
    await this.page.evaluate(() => {
      document.querySelectorAll('[id*="cookie"], [class*="cookie"], [class*="consent"], [class*="fc-"], #onetrust-banner-sdk, .qc-cmp2-container, .fc-dialog-overlay, .fc-consent-root').forEach((el) => el.remove());
    }).catch(() => undefined);
    await this.page.locator('input#id_gender1').check({ force: true });
    await this.page.locator('input#password').fill(password);
    await this.page.locator('#days').selectOption('1');
    await this.page.locator('#months').selectOption('January');
    await this.page.locator('#years').selectOption('1990');
    await this.page.locator('input#newsletter').check({ force: true }).catch(() => undefined);
    await this.page.locator('input#optin').check({ force: true }).catch(() => undefined);
    await this.page.locator('input#first_name').fill('QA');
    await this.page.locator('input#last_name').fill('User');
    await this.page.locator('input#company').fill('Test Company');
    await this.page.locator('input#address1').fill('Address 1');
    await this.page.locator('input#address2').fill('Address 2');
    await this.page.locator('#country').selectOption('United States');
    await this.page.locator('input#state').fill('State');
    await this.page.locator('input#city').fill('City');
    await this.page.locator('input#zipcode').fill('12345');
    await this.page.locator('input#mobile_number').fill('1234567890');
    await this.page.locator('button[data-qa="create-account"]').click({ force: true });
  }

  async login(email: string, password: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}
