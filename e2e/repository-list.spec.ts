import { test, expect } from '@playwright/test';
import { RepositoryListPage } from './pages/repository-list.page';
import { NavbarPage } from './pages/navbar.page';

test.describe('Repository List', () => {
  let repoListPage: RepositoryListPage;

  test.beforeEach(async ({ page }) => {
    repoListPage = new RepositoryListPage(page);
    await repoListPage.goto();
    await repoListPage.waitForCards();
  });

  test('should display repositories list', async () => {
    const count = await repoListPage.repoCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display repo name, description and language', async ({ page }) => {
    const name  = await page.locator('.repo-name').first().textContent();
    const desc  = await page.locator('.repo-description').first().textContent();
    const lang  = await page.locator('.repo-lang').first().textContent();
    expect(name?.trim().length).toBeGreaterThan(0);
    expect(desc?.trim().length).toBeGreaterThan(0);
    expect(lang?.trim().length).toBeGreaterThan(0);
  });

  test('should navigate to repo detail on card click', async ({ page }) => {
    await repoListPage.clickCard(0);
    await expect(page).toHaveURL(/\/repositories\/\d+/);
  });

  test('should have active nav link on Repositories', async ({ page }) => {
    const navbar = new NavbarPage(page);
    await expect(navbar.reposLink).toHaveClass(/nav-active/);
  });
});