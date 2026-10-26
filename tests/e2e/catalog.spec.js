import { test, expect } from '@playwright/test'

test.describe('catalog', () => {
  test('lists all 12 history courses with real data', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Study the past, one course at a time' })).toBeVisible()
    await expect(page.locator('.course-card')).toHaveCount(12)
    await expect(page.getByText('12 of 12 courses')).toBeVisible()
    await expect(page.getByRole('link', { name: /The Silk Roads: Trade, Religion, and Exchange/ })).toBeVisible()
  })

  test('search narrows the catalog to matching courses', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('silk')
    await expect(page.locator('.course-card')).toHaveCount(1)
    await expect(page.getByText('1 of 12 courses')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'The Silk Roads: Trade, Religion, and Exchange' })).toBeVisible()
  })

  test('search also matches instructor names', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('Leila Rahman')
    const count = await page.locator('.course-card').count()
    expect(count).toBeGreaterThan(0)
    for (const card of await page.locator('.course-card').all()) {
      await expect(card).toContainText('Dr. Leila Rahman')
    }
  })

  test('instructor filter shows only that instructor\'s courses', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Filter by instructor' }).selectOption({ label: 'Dr. Leila Rahman' })
    const cards = page.locator('.course-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    for (const card of await cards.all()) {
      await expect(card).toContainText('Dr. Leila Rahman')
    }
  })

  test('duration filter shows only courses of that length', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Filter by duration' }).selectOption('8')
    await expect(page.locator('.course-card')).toHaveCount(1)
    await expect(page.getByRole('heading', { name: 'World War II: A Global History' })).toBeVisible()
  })

  test('sort by duration orders the shortest course first', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('combobox', { name: 'Sort courses' }).selectOption('duration')
    const firstCardStats = page.locator('.course-card').first().locator('.course-card-stats')
    await expect(firstCardStats).toContainText('5w')
  })

  test('a query with no matches shows the empty state and clears via the button', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('zzzznothingmatches')
    await expect(page.getByText('No courses match your search or filters.')).toBeVisible()
    await expect(page.locator('.course-card')).toHaveCount(0)
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.locator('.course-card')).toHaveCount(12)
  })

  test('reset button restores every filter after they are changed', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('searchbox', { name: 'Search courses' }).fill('silk')
    await page.getByRole('combobox', { name: 'Filter by duration' }).selectOption('5')
    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(page.locator('.course-card')).toHaveCount(12)
    await expect(page.getByRole('searchbox', { name: 'Search courses' })).toHaveValue('')
  })

  test('clicking a course card opens its course page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /The Silk Roads: Trade, Religion, and Exchange/ }).click()
    await expect(page).toHaveURL(/#\/courses\/HIST111$/)
    await expect(page.getByRole('heading', { name: 'The Silk Roads: Trade, Religion, and Exchange', level: 1 })).toBeVisible()
  })
})
