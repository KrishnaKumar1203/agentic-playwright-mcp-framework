import { Page, expect } from '@playwright/test';

export class BrowserUtils {
  /**
   * Wait for multiple selectors to be visible
   */
  static async waitForMultipleSelectors(page: Page, selectors: string[], timeout: number = 5000) {
    return Promise.all(selectors.map((selector) => page.waitForSelector(selector, { timeout })));
  }

  /**
   * Get all text content from elements
   */
  static async getMultipleTextContents(page: Page, selector: string): Promise<string[]> {
    return await page.$$eval(selector, (elements) =>
      elements.map((el) => el.textContent?.trim() || ''),
    );
  }

  /**
   * Click element and wait for navigation
   */
  static async clickAndWaitForNavigation(page: Page, selector: string) {
    await Promise.all([page.waitForNavigation(), page.click(selector)]);
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return await page.screenshot({ path: `screenshots/${name}-${timestamp}.png` });
  }

  /**
   * Check if element is in viewport
   */
  static async isElementInViewport(page: Page, selector: string): Promise<boolean> {
    return await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
    }, selector);
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }
}
