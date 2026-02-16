import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test('redirects to auth when not logged in', async ({ page }) => {
    await page.goto('/search')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('search page with query param redirects to auth when not logged in', async ({ page }) => {
    await page.goto('/search?q=naruto')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('auth page is accessible after search redirect', async ({ page }) => {
    await page.goto('/search?q=test')
    await expect(page).toHaveURL(/\/auth/)

    // Verify auth page works
    await expect(page.getByText('Welcome')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })
})
