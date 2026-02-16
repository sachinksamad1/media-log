import { test, expect } from '@playwright/test'

test.describe('Stats Page', () => {
  test('redirects to auth when not logged in', async ({ page }) => {
    await page.goto('/stats')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('auth page renders correctly after stats redirect', async ({ page }) => {
    await page.goto('/stats')
    await expect(page).toHaveURL(/\/auth/)

    await expect(page.getByText('Welcome')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible()
  })
})
