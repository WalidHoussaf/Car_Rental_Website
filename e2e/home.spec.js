import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Rent My Ride/i);
  });

  test('should display hero section', async ({ page }) => {
    const heroHeading = page.getByRole('heading', { name: /rent my ride/i });
    await expect(heroHeading).toBeVisible();
  });

  test('should navigate to cars page from CTA button', async ({ page }) => {
    const browseCarsButton = page.getByRole('link', { name: /browse cars/i });
    await browseCarsButton.click();
    
    await expect(page).toHaveURL(/\/cars/);
  });

  test('should display navigation menu', async ({ page }) => {
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /cars/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('should show login and register buttons when not authenticated', async ({ page }) => {
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    const featuresSection = page.getByText(/why choose us/i);
    await featuresSection.scrollIntoViewIfNeeded();
    await expect(featuresSection).toBeVisible();
  });

  test('should have working footer links', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    
    await expect(footer.getByRole('link', { name: /privacy/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /terms/i })).toBeVisible();
  });
});
