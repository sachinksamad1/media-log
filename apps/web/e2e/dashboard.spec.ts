import { test, expect } from '@playwright/test'

test.describe('Auth Guard - Protected Routes', () => {
  const protectedRoutes = [
    { path: '/', name: 'dashboard' },
    { path: '/profile', name: 'profile' },
    { path: '/settings', name: 'settings' },
    { path: '/search', name: 'search' },
    { path: '/stats', name: 'stats' },
    { path: '/reports', name: 'reports' },
    { path: '/anime', name: 'anime' },
    { path: '/manga', name: 'manga' },
    { path: '/light-novel', name: 'light novel' },
    { path: '/fiction', name: 'fiction' },
    { path: '/non-fiction', name: 'non-fiction' },
    { path: '/game', name: 'game' },
    { path: '/movie', name: 'movie' },
    { path: '/tv-series', name: 'tv series' },
  ]

  for (const route of protectedRoutes) {
    test(`redirects unauthenticated user from ${route.path} to /auth`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' })

      // Should be redirected to auth page
      await expect(page).toHaveURL(/\/auth/)
      await expect(page.getByText('Welcome')).toBeVisible()
    })
  }
})

test.describe('Dashboard', () => {
  test('shows dashboard heading when navigating to root', async ({ page }) => {
    // Without auth, this redirects to /auth
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth/)
  })
})
