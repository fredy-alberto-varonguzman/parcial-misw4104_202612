import { test, expect } from '@playwright/test';
import { NavbarPage } from './pages/navbar.page';

test.describe('Navbar', () => {
  test('should show DevHub brand', async ({ page }) => {
    await page.goto('/');
    const navbar = new NavbarPage(page);
    await expect(navbar.brand).toBeVisible();
    await expect(navbar.brand).toContainText('DevHub');
  });

  test('should navigate to users when clicking Users', async ({ page }) => {
    await page.goto('/');
    const navbar = new NavbarPage(page);
    await navbar.goToUsers();
    await expect(page).toHaveURL(/\/users/);
  });

  test('should navigate to repositories when clicking Repositories', async ({ page }) => {
    await page.goto('/');
    const navbar = new NavbarPage(page);
    await navbar.goToRepositories();
    await expect(page).toHaveURL(/\/repositories/);
  });
});