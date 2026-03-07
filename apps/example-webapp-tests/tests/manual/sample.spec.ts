import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage';
import { DashboardPage } from '../pageObjects/DashboardPage';

// Load credentials from environment variables
const getTestCredentials = () => {
  const username = process.env.APP_USER_ISB_DEV || process.env.TEST_USER || 'demo_user';
  const password = process.env.APP_PASSWORD_ISB_DEV || process.env.TEST_PASSWORD || 'demo_password';
  const invalidUsername = process.env.INVALID_USER || 'invalid_user_' + Date.now();
  const invalidPassword = process.env.INVALID_PASSWORD || 'wrong_password';
  
  return { username, password, invalidUsername, invalidPassword };
};

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  const credentials = getTestCredentials();

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Uses credentials from environment variables or defaults
    await loginPage.login(credentials.username, credentials.password);
    await expect(page).toHaveURL(/.*dashboard/);
    const message = await dashboardPage.getWelcomeMessage();
    expect(message).toBeTruthy();
  });

  test('should show error with invalid credentials', async () => {
    // Uses dynamically generated invalid credentials (no hardcoding)
    await loginPage.login(credentials.invalidUsername, credentials.invalidPassword);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid');
  });

  test('should remain on login page after failed attempt', async ({ page }) => {
    // Uses dynamically generated invalid credentials (no hardcoding)
    await loginPage.login(credentials.invalidUsername, credentials.invalidPassword);
    await expect(page).toHaveURL(/.*login/);
  });
});
