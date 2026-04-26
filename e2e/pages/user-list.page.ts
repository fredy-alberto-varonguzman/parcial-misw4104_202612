import { Page } from '@playwright/test';

export class UserListPage {
  constructor(private page: Page) {}

  async goto()           { await this.page.goto('/users'); }
  get userCards()        { return this.page.locator('.user-card'); }
  get firstCard()        { return this.userCards.first(); }
  get errorMessage()     { return this.page.locator('.alert-error'); }
  get loadingSpinner()   { return this.page.locator('.spinner'); }

  async waitForCards()   {
    await this.page.waitForSelector('.user-card', { timeout: 10000 });
  }
  async clickCard(index: number) {
    await this.userCards.nth(index).click();
  }
}