import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should load registration page successfully', async ({ page }) => {
    await page.goto('/register');

    // Check page title and key elements
    await expect(page).toHaveTitle(/Register/);
    await expect(page.locator('h1')).toContainText('Create your account');

    // Check form fields exist
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('should validate form fields correctly', async ({ page }) => {
    await page.goto('/register');

    // Test empty form submission
    await page.click('button[type="submit"]');

    // Check validation messages appear
    await expect(page.locator('text=Username is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should validate username requirements', async ({ page }) => {
    await page.goto('/register');

    // Test username too short
    await page.fill('input[name="username"]', 'ab');
    await page.blur('input[name="username"]');
    await expect(page.locator('text=Username must be at least 3 characters')).toBeVisible();

    // Test invalid characters
    await page.fill('input[name="username"]', 'test@user');
    await page.blur('input[name="username"]');
    await expect(page.locator('text=Username can only contain letters, numbers, and underscores')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');

    // Test invalid email format
    await page.fill('input[name="email"]', 'invalid-email');
    await page.blur('input[name="email"]');
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await page.goto('/register');

    // Test weak password
    await page.fill('input[name="password"]', '123');
    await page.blur('input[name="password"]');
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();

    // Test password without uppercase
    await page.fill('input[name="password"]', 'password123');
    await page.blur('input[name="password"]');
    await expect(page.locator('text=Password must contain at least one uppercase letter')).toBeVisible();

    // Test password without number
    await page.fill('input[name="password"]', 'Password');
    await page.blur('input[name="password"]');
    await expect(page.locator('text=Password must contain at least one number')).toBeVisible();
  });

  test('should show password strength indicator', async ({ page }) => {
    await page.goto('/register');

    const passwordInput = page.locator('input[name="password"]');

    // Test weak password
    await passwordInput.fill('123');
    await expect(page.locator('[data-testid="password-strength"]')).toHaveClass(/weak/);

    // Test medium password
    await passwordInput.fill('Password1');
    await expect(page.locator('[data-testid="password-strength"]')).toHaveClass(/medium|good/);

    // Test strong password
    await passwordInput.fill('SecurePass123!');
    await expect(page.locator('[data-testid="password-strength"]')).toHaveClass(/strong|excellent/);
  });

  test('should require terms acceptance', async ({ page }) => {
    await page.goto('/register');

    // Fill valid form but don't check terms
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=You must accept the terms and conditions')).toBeVisible();
  });

  test('should attempt registration with valid data', async ({ page }) => {
    await page.goto('/register');

    // Fill valid form data
    await page.fill('input[name="username"]', 'testuser123');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.check('input[type="checkbox"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Check for loading state or success message
    // Note: This may fail if backend isn't connected, but we can verify the attempt
    await expect(page.locator('button[type="submit"]')).toHaveAttribute('disabled', '');
  });
});

test.describe('Login Flow', () => {
  test('should load login page successfully', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('h1')).toContainText('Welcome back');

    // Check form fields
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should validate login form', async ({ page }) => {
    await page.goto('/login');

    // Test empty form
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should attempt login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.click('button[type="submit"]');

    // Check for loading state
    await expect(page.locator('button[type="submit"]')).toHaveAttribute('disabled', '');
  });
});

test.describe('Page Navigation', () => {
  test('should redirect protected pages to login', async ({ page }) => {
    // Test interests page redirect
    await page.goto('/interests');
    await expect(page.url()).toContain('/login');

    // Test subcategories page redirect
    await page.goto('/subcategories');
    await expect(page.url()).toContain('/login');

    // Test deal-breakers page redirect
    await page.goto('/deal-breakers');
    await expect(page.url()).toContain('/login');
  });

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/login');

    // Navigate to register
    await page.click('text=Create account');
    await expect(page.url()).toContain('/register');

    // Navigate back to login
    await page.click('text=Sign in');
    await expect(page.url()).toContain('/login');
  });
});