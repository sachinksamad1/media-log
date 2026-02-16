import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('navigating to /login redirects to /auth', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/\/auth/)
    await expect(page.getByText('Welcome')).toBeVisible()
  })

  test('auth page does not show app shell layout', async ({ page }) => {
    // Auth page has hideLayout: true, so AppShell (header/sidebar) should not render
    await page.goto('/auth')

    // The auth page should be visible
    await expect(page.getByText('Welcome')).toBeVisible()

    // The page should be centered (no sidebar layout)
    const authContainer = page.locator('.min-h-screen.flex.items-center.justify-center')
    await expect(authContainer).toBeVisible()
  })

  test('page title is set correctly', async ({ page }) => {
    await page.goto('/auth')
    await expect(page).toHaveTitle('MediaLog')
  })

  test('app root mounts correctly', async ({ page }) => {
    await page.goto('/auth')
    const appRoot = page.locator('#app')
    await expect(appRoot).toBeVisible()
    // Should have child content rendered
    await expect(appRoot).not.toBeEmpty()
  })
})
