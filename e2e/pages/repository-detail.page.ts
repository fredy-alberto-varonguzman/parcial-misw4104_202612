import { Page } from '@playwright/test';

export class RepositoryDetailPage {
  constructor(private page: Page) {}

  get repoTitle()     { return this.page.locator('.repo-title'); }
  get backButton()    { return this.page.locator('.breadcrumb-back'); }
  get emptyState()    { return this.page.locator('.empty-state'); }
  get repoName()      { return this.page.locator('.repo-name'); }

  async waitForLoad() {
    await this.page.waitForSelector('.page-container', { timeout: 10000 });
  }
  async goBack()      { await this.backButton.click(); }
}
