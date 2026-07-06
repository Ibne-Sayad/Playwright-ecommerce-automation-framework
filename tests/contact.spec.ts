import { test, expect } from '@playwright/test';
import './hooks';
import { HomePage } from '../pages/HomePage';
import { neutralizeAds } from '../utils/neutralize-ads';
import { ContactPage } from '../pages/ContactPage';

test.describe('Contact us', () => {
  test('submits the contact form successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openContact();
    await contactPage.submitForm('Jane Doe', 'jane@example.com', 'Question', 'Hello from Playwright');

    await expect(contactPage.successMessage).toContainText('Success! Your details have been submitted successfully.');
  });
});
