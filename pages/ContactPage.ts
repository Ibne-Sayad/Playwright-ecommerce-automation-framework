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
    await neutralizeAds(this.page);
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.submitButton.click({ force: true, noWaitAfter: true });
    await this.page.waitForFunction(
      () => document.querySelector('div.status.alert-success')?.textContent?.includes('Success! Your details have been submitted successfully.'),
      undefined,
      { timeout: 10_000 }
    );
  }
}
