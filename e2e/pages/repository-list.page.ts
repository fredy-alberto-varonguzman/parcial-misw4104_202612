import { Page } from '@playwright/test';

export class RepositoryListPage {
  constructor(private page: Page) {}

  async goto()         { await this.page.goto('/repositories'); }
  get repoCards()      { return this.page.locator('.repo-card'); }
  get firstCard()      { return this.repoCards.first(); }
  get loadingSpinner() { return this.page.locator('.spinner'); }

  async waitForCards() {
    await this.page.waitForSelector('.repo-card', { timeout: 10000 });
  }
  async clickCard(index: number) {
    await this.repoCards.nth(index).click();
  }
}