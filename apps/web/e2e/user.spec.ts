import { test, expect } from '@playwright/test'

test.describe('Profile Page', () => {
  test('redirects to auth when not logged in', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('auth page is functional after profile redirect', async ({ page }) => {
    await page.goto('/profile')
    await expect(page).toHaveURL(/\/auth/)

    await expect(page.getByText('Welcome')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })
})

test.describe('Settings Page', () => {
  test('redirects to auth when not logged in', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('auth page is functional after settings redirect', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/auth/)

    await expect(page.getByText('Welcome')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sign Up' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible()
  })
})
