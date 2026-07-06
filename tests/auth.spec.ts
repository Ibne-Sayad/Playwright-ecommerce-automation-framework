import { test, expect } from '@playwright/test';
import './hooks';
import { HomePage } from '../pages/HomePage';
import { neutralizeAds } from '../utils/neutralize-ads';
import { LoginPage } from '../pages/LoginPage';
import users from '../test-data/users.json';
import { generateUserData } from '../utils/testDataGenerator';

test.describe('Authentication flow', () => {
  test('loads the home page successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    await neutralizeAds(page);
    await homePage.goto();
    await homePage.expectLoaded();
    await expect(page).toHaveURL(/automationexercise\.com\/$/);
  });

  test('registers a new user with generated test data', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const user = generateUserData();

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openSignupLogin();
    await loginPage.register(user.name, user.email);

    await expect(page.getByText('Enter Account Information')).toBeVisible();
  });

  test('logs in with valid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const user = generateUserData();

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openSignupLogin();
    await loginPage.register(user.name, user.email);
    await loginPage.completeSignup(user.password);
    await expect(page.getByText('Account Created!')).toBeVisible();

    await homePage.goto();
    await homePage.openSignupLogin();
    await loginPage.login(user.email, user.password);

    await expect(page.locator('a[href="/logout"]')).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await neutralizeAds(page);
    await homePage.goto();
    await homePage.openSignupLogin();
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);

    await expect(loginPage.errorMessage).toContainText('Your email or password is incorrect');
  });
});
