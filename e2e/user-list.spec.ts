import { test, expect } from '@playwright/test';
import { UserListPage } from './pages/user-list.page';
import { NavbarPage } from './pages/navbar.page';

test.describe('User List', () => {
  let userListPage: UserListPage;

  test.beforeEach(async ({ page }) => {
    userListPage = new UserListPage(page);
    await userListPage.goto();
    await userListPage.waitForCards();
  });

  test('should display the users list', async () => {
    const count = await userListPage.userCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display name and role in each card', async ({ page }) => {
    const firstName = await page.locator('.user-card__name').first().textContent();
    const firstRole = await page.locator('.user-card__badge').first().textContent();
    expect(firstName?.trim().length).toBeGreaterThan(0);
    expect(firstRole?.trim().length).toBeGreaterThan(0);
  });

  test('should show user detail when clicking a card', async ({ page }) => {
    await userListPage.clickCard(0);
    await expect(page.locator('app-user-detail')).toBeVisible();
  });

  test('should deselect user when clicking same card twice', async ({ page }) => {
    await userListPage.clickCard(0);
    await expect(page.locator('app-user-detail')).toBeVisible();
    await userListPage.clickCard(0);
    await expect(page.locator('app-user-detail')).not.toBeVisible();
  });

  test('should have active nav link on Users', async ({ page }) => {
    const navbar = new NavbarPage(page);
    await expect(navbar.usersLink).toHaveClass(/nav-active/);
  });
});