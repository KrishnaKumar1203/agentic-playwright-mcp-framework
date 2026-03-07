import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField = '[name="username"]';
  readonly passwordField = '[name="password"]';
  readonly loginButton = 'button:has-text("Login")';
  readonly errorMessage = '.error-message';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.page.textContent(this.errorMessage) || '';
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.page.url().includes('/dashboard');
  }
}
