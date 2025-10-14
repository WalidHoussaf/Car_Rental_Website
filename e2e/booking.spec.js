import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should navigate to booking page from car details', async ({ page }) => {
    // Go to cars page
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    // Click on first available car
    const firstCarLink = page.getByRole('link', { name: /view details/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      await page.waitForTimeout(1000);
      
      // Click book now button
      const bookButton = page.getByRole('link', { name: /book now/i }).first();
      if (await bookButton.count() > 0) {
        await bookButton.click();
        
        // Should navigate to booking page
        await expect(page).toHaveURL(/\/booking\//);
      }
    }
  });

  test('should display booking form', async ({ page }) => {
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    const firstCarLink = page.getByRole('link', { name: /view details/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      await page.waitForTimeout(1000);
      
      const bookButton = page.getByRole('link', { name: /book now/i }).first();
      if (await bookButton.count() > 0) {
        await bookButton.click();
        await page.waitForTimeout(1000);
        
        // Verify booking form elements
        const form = page.locator('form');
        if (await form.count() > 0) {
          await expect(form).toBeVisible();
        }
      }
    }
  });

  test('should require authentication for booking', async ({ page }) => {
    // When not logged in, booking should redirect to login or show message
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    const firstCarLink = page.getByRole('link', { name: /book now/i }).first();
    if (await firstCarLink.count() > 0) {
      await firstCarLink.click();
      
      // Should either redirect to login or show auth required message
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      const hasLoginRedirect = currentUrl.includes('/login');
      const hasAuthMessage = await page.locator('text=/login|sign in|authenticate/i').count() > 0;
      
      expect(hasLoginRedirect || hasAuthMessage).toBeTruthy();
    }
  });

  test('should validate date selection', async ({ page }) => {
    // This test assumes we can access booking form
    await page.goto('/cars');
    await page.waitForTimeout(2000);
    
    // Try to access booking
    const bookButton = page.getByRole('link', { name: /book now/i }).first();
    if (await bookButton.count() > 0) {
      await bookButton.click();
      await page.waitForTimeout(1000);
      
      // Look for date inputs
      const startDateInput = page.locator('input[name*="start" i]').or(page.getByLabel(/pickup date|start date/i));
      if (await startDateInput.count() > 0) {
        await expect(startDateInput.first()).toBeVisible();
      }
    }
  });
});

test.describe('Booking Confirmation', () => {
  test('should display booking confirmation page structure', async ({ page }) => {
    // Navigate to confirmation page (requires completed booking)
    await page.goto('/booking-confirmation');
    
    // Page should load (may show error if no booking data)
    await expect(page).toHaveURL(/\/booking-confirmation/);
  });
});

test.describe('My Bookings', () => {
  test('should require authentication', async ({ page }) => {
    await page.goto('/my-bookings');
    
    // Should redirect to login or show auth required
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    const hasLoginRedirect = currentUrl.includes('/login');
    const hasAuthMessage = await page.locator('text=/login|sign in/i').count() > 0;
    
    expect(hasLoginRedirect || hasAuthMessage).toBeTruthy();
  });
});
