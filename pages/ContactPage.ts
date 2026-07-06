import { Page, Locator } from '@playwright/test';
import { neutralizeAds } from '../utils/neutralize-ads';

export class ContactPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[data-qa="name"]');
    this.emailInput = page.locator('input[data-qa="email"]');
    this.subjectInput = page.locator('input[data-qa="subject"]');
    this.messageInput = page.locator('textarea[data-qa="message"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('div.status.alert-success');
  }

  async submitForm(name: string, email: string, subject: string, message: string) {
    await neutralizeAds(this.page);
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill(subject);
    await this.messageInput.fill(message);
    await this.page.evaluate(() => {
      document.querySelectorAll('.fc-dialog-overlay, .fc-consent-root').forEach(el => el.remove());
    });
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.submitButton.click({ force: true });
    // wait for success message to populate (allow for redirect or async update)
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    } catch (e) {
      // ignore - test will assert later; this gives buffer time
    }
  }
}
