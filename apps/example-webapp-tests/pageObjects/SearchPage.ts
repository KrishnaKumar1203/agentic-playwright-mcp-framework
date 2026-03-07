import { Page } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput = '[data-testid="search-input"]';
  readonly searchButton = '[data-testid="search-button"]';
  readonly resultsContainer = '.results-container';
  readonly resultItem = '.result-item';
  readonly resultCount = '.result-count';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/search');
  }

  async search(query: string) {
    await this.page.fill(this.searchInput, query);
    await this.page.click(this.searchButton);
    await this.page.waitForSelector(this.resultsContainer);
  }

  async getResultCount(): Promise<number> {
    const text = await this.page.textContent(this.resultCount);
    return text ? parseInt(text.match(/\d+/)?.[0] || '0') : 0;
  }

  async getResults(): Promise<string[]> {
    const results = await this.page.$$eval(this.resultItem, (elements) =>
      elements.map((el) => el.textContent || ''),
    );
    return results;
  }

  async clickResult(index: number) {
    const results = await this.page.$$(this.resultItem);
    if (index < results.length) {
      await results[index].click();
    }
  }
}
