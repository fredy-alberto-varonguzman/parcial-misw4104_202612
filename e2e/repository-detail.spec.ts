import { test, expect } from '@playwright/test';
import { RepositoryListPage } from './pages/repository-list.page';
import { RepositoryDetailPage } from './pages/repository-detail.page';

test.describe('Repository Detail', () => {
  let detailPage: RepositoryDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new RepositoryDetailPage(page);
    const listPage = new RepositoryListPage(page);
    await listPage.goto();
    await listPage.waitForCards();
    await listPage.clickCard(0);
    await detailPage.waitForLoad();
  });

  test('should display repo title', async () => {
    await expect(detailPage.repoTitle).toBeVisible();
    const title = await detailPage.repoTitle.textContent();
    expect(title?.trim().length).toBeGreaterThan(0);
  });

  test('should display back button', async () => {
    await expect(detailPage.backButton).toBeVisible();
    await expect(detailPage.backButton).toContainText('Volver al listado');
  });

  test('should navigate back to list when clicking back button', async ({ page }) => {
    await detailPage.goBack();
    await expect(page).toHaveURL(/\/repositories$/);
  });

  test('should show error state for invalid repo id', async ({ page }) => {
    await page.goto('/repositories/99999');
    await detailPage.waitForLoad();
    await expect(detailPage.emptyState).toBeVisible();
  });
});