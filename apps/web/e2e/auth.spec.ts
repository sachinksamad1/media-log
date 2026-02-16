import { test, expect } from '@playwright/test'

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth')
  })

  test('renders the auth page with branding', async ({ page }) => {
    // Logo and branding (text is hidden on mobile)
    const branding = page.locator('text=MediaLog').first()
    const viewport = page.viewportSize()
    if (viewport && viewport.width >= 640) {
      await expect(branding).toBeVisible()
    }

    // Card header
    await expect(page.getByText('Welcome')).toBeVisible()
    await expect(page.getByText('Sign in or create an account')).toBeVisible()
  })

  test('shows sign in and sign up tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible()
  })

  test('sign in tab shows email and password fields', async ({ page }) => {
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('sign in tab shows forgot password and username links', async ({ page }) => {
    await expect(page.getByText('Forgot Password?')).toBeVisible()
    await expect(page.getByText('Forgot Username?')).toBeVisible()
  })

  test('can switch to sign up tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Sign Up' }).click()

    await expect(page.getByPlaceholder('Username')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible()
    await expect(page.getByPlaceholder('Confirm Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('shows Google sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible()
  })

  test('forgot password link opens recovery form', async ({ page }) => {
    await page.getByText('Forgot Password?').click()

    await expect(page.getByText('Recover Password')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send Reset Link' })).toBeVisible()
  })

  test('forgot username link opens recovery form', async ({ page }) => {
    await page.getByText('Forgot Username?').click()

    await expect(page.getByText('Recover Username')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Send My Username' })).toBeVisible()
  })

  test('recovery form has back to sign in link', async ({ page }) => {
    await page.getByText('Forgot Password?').click()

    const backButton = page.getByRole('button', { name: 'Back to Sign In' })
    await expect(backButton).toBeVisible()

    await backButton.click()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
  })

  test('recovery form can switch between password and username recovery', async ({ page }) => {
    await page.getByText('Forgot Password?').click()

    // Should start on password recovery
    await expect(page.getByText('Recover Password')).toBeVisible()

    // Switch to username recovery
    await page.getByRole('button', { name: 'Username' }).click()
    await expect(page.getByText('Recover Username')).toBeVisible()

    // Switch back to password recovery
    await page.getByRole('button', { name: 'Password' }).click()
    await expect(page.getByText('Recover Password')).toBeVisible()
  })
})
