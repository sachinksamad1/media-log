import { test, expect } from '@playwright/test'

test.describe('App Shell', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('MediaLog')
  })

  test('renders the Vue app root', async ({ page }) => {
    await page.goto('/')

    const appRoot = page.locator('#app')
    await expect(appRoot).toBeVisible()
  })
})
