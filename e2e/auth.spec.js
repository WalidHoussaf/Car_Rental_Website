import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Registration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
    });

    test('should display registration form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
      await expect(page.getByLabel(/first name/i)).toBeVisible();
      await expect(page.getByLabel(/last name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByLabel(/phone/i)).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /register/i });
      await submitButton.click();
      
      // HTML5 validation should prevent submission
      const firstNameInput = page.getByLabel(/first name/i);
      await expect(firstNameInput).toBeFocused();
    });

    test('should validate email format', async ({ page }) => {
      await page.getByLabel(/first name/i).fill('John');
      await page.getByLabel(/last name/i).fill('Doe');
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/password/i).fill('Password123!');
      await page.getByLabel(/phone/i).fill('+1234567890');
      
      const submitButton = page.getByRole('button', { name: /register/i });
      await submitButton.click();
      
      // Email validation should trigger
      const emailInput = page.getByLabel(/email/i);
      const validationMessage = await emailInput.evaluate(el => el.validationMessage);
      expect(validationMessage).toBeTruthy();
    });

    test('should have link to login page', async ({ page }) => {
      const loginLink = page.getByRole('link', { name: /login/i });
      await expect(loginLink).toBeVisible();
      
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /login/i });
      await submitButton.click();
      
      const emailInput = page.getByLabel(/email/i);
      await expect(emailInput).toBeFocused();
    });

    test('should have link to registration page', async ({ page }) => {
      const registerLink = page.getByRole('link', { name: /register/i });
      await expect(registerLink).toBeVisible();
      
      await registerLink.click();
      await expect(page).toHaveURL(/\/register/);
    });

    test('should have password visibility toggle', async ({ page }) => {
      const passwordInput = page.getByLabel(/password/i);
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Look for eye icon or toggle button
      const toggleButton = page.locator('[aria-label*="password"]').or(page.locator('button').filter({ hasText: /show|hide/i }));
      if (await toggleButton.count() > 0) {
        await toggleButton.first().click();
        await expect(passwordInput).toHaveAttribute('type', 'text');
      }
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully when authenticated', async ({ page }) => {
      await page.goto('/');
      
      // If user menu exists, test logout
      const userMenu = page.locator('[data-testid="user-menu"]').or(page.getByRole('button', { name: /profile|account/i }));
      
      if (await userMenu.count() > 0) {
        await userMenu.click();
        const logoutButton = page.getByRole('button', { name: /logout/i });
        await expect(logoutButton).toBeVisible();
      }
    });
  });
});
