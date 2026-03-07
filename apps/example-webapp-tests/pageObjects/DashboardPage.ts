import { Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage = '.welcome-message';
  readonly userProfile = '[data-testid="user-profile"]';
  readonly logoutButton = 'button:has-text("Logout")';
  readonly mainContent = '.main-content';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async getWelcomeMessage(): Promise<string> {
    return await this.page.textContent(this.welcomeMessage) || '';
  }

  async getUserProfile(): Promise<string> {
    return await this.page.textContent(this.userProfile) || '';
  }

  async logout() {
    await this.page.click(this.logoutButton);
  }

  async isLoaded(): Promise<boolean> {
    return await this.page.isVisible(this.mainContent);
  }
}
