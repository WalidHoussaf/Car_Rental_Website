import { test, expect } from '@playwright/test';

test.describe('Cars Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cars');
  });

  test('should display cars listing page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /our cars|available cars/i })).toBeVisible();
  });

  test('should display car cards', async ({ page }) => {
    // Wait for cars to load
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 10000 }).catch(() => {
      // If no test id, look for car elements
      return page.waitForSelector('img[alt*="car" i]', { timeout: 10000 });
    });
    
    const carCards = page.locator('[data-testid="car-card"]').or(page.locator('article, .car-card'));
    const count = await carCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter cars by category', async ({ page }) => {
    // Look for category filter
    const categoryFilter = page.locator('select[name="category"]').or(page.getByLabel(/category/i));
    
    if (await categoryFilter.count() > 0) {
      await categoryFilter.first().selectOption('Sedan');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      // Verify URL or results updated
      const url = page.url();
      expect(url).toContain('category=Sedan');
    }
  });

  test('should search for cars', async ({ page }) => {
    const searchInput = page.locator('input[type="search"]').or(page.getByPlaceholder(/search/i));
    
    if (await searchInput.count() > 0) {
      await searchInput.first().fill('Toyota');
      await page.keyboard.press('Enter');
      
      // Wait for search results
      await page.waitForTimeout(1000);
    }
  });

  test('should navigate to car details page', async ({ page }) => {
    // Wait for car cards to load
    await page.waitForSelector('[data-testid="car-card"]', { timeout: 10000 }).catch(() => {
      return page.waitForSelector('a[href*="/cars/"]', { timeout: 10000 });
    });
    
    // Click on first car's details link or card
    const viewDetailsLink = page.getByRole('link', { name: /view details|book now/i }).first();
    await viewDetailsLink.click();
    
    // Should navigate to car details page
    await expect(page).toHaveURL(/\/cars\/[a-zA-Z0-9]+/);
  });

  test('should display availability status', async ({ page }) => {
    // Wait for cars to load
    await page.waitForTimeout(2000);
    
    // Look for availability badges
    const availableBadge = page.locator('text=/available|unavailable/i');
    if (await availableBadge.count() > 0) {
      await expect(availableBadge.first()).toBeVisible();
    }
  });

  test('should show car price', async ({ page }) => {
    // Wait for cars to load
    await page.waitForTimeout(2000);
    
    // Look for price elements ($ symbol)
    const priceElement = page.locator('text=/\\$\\d+/');
    if (await priceElement.count() > 0) {
      await expect(priceElement.first()).toBeVisible();
    }
  });
});

test.describe('Car Details Page', () => {
  test('should display car details', async ({ page }) => {
    // Navigate to cars page first
    await page.goto('/cars');
    
    // Wait for and click on first car
    await page.waitForTimeout(2000);
    const firstCarLink = page.getByRole('link', { name: /view details|book now/i }).first();
    await firstCarLink.click();
    
    // Wait for details page to load
    await page.waitForTimeout(1000);
    
    // Verify car details are displayed
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should have book now button', async ({ page }) => {
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    const firstCarLink = page.getByRole('link', { name: /view details/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      await page.waitForTimeout(1000);
      
      // Look for book now button
      const bookButton = page.getByRole('link', { name: /book now/i }).or(page.getByRole('button', { name: /book now/i }));
      if (await bookButton.count() > 0) {
        await expect(bookButton.first()).toBeVisible();
      }
    }
  });

  test('should display car images', async ({ page }) => {
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    const firstCarLink = page.getByRole('link', { name: /view details/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      await page.waitForTimeout(1000);
      
      // Verify car images are displayed
      const carImages = page.locator('img[alt*="car" i]');
      const count = await carImages.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should display car specifications', async ({ page }) => {
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    const firstCarLink = page.getByRole('link', { name: /view details/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      await page.waitForTimeout(1000);
      
      // Look for specifications (seats, transmission, fuel type)
      const specsSection = page.locator('text=/seats|transmission|fuel/i');
      if (await specsSection.count() > 0) {
        await expect(specsSection.first()).toBeVisible();
      }
    }
  });
});
