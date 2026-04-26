import { Page } from '@playwright/test';

export class NavbarPage {
  constructor(private page: Page) {}

  get brand() {
    return this.page.locator('.navbar-brand');
  }
  get usersLink() {
    return this.page.locator('.navbar-links a[routerLink="/users"]');
  }

  get reposLink() {
    return this.page.locator('.navbar-links a[routerLink="/repositories"]');
  }

  async goToUsers() {
    await this.usersLink.click();
  }
  async goToRepositories() {
    await this.reposLink.click();
  }
}
