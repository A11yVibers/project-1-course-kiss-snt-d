import { test, expect } from '@playwright/test'

test.describe('collapsible course info pane', () => {
  test('collapsing hides the syllabus from the accessibility tree and expanding restores it', async ({ page }) => {
    await page.goto('/#/courses/HIST111')
    const toggle = page.getByRole('button', { name: 'Collapse course information' })
    const syllabusHeading = page.getByRole('heading', { name: 'Syllabus' })

    await expect(syllabusHeading).toBeVisible()
    await toggle.click()
    await expect(syllabusHeading).toBeHidden()
    await expect(page.getByRole('button', { name: 'Expand course information' })).toBeVisible()

    await page.getByRole('button', { name: 'Expand course information' }).click()
    await expect(syllabusHeading).toBeVisible()
  })

  test('the material viewer keeps working while the pane is collapsed', async ({ page }) => {
    await page.goto('/#/courses/HIST111')
    await page.getByRole('button', { name: 'Collapse course information' }).click()
    await expect(page.locator('.viewer-hero-image')).toBeVisible()
  })
})

test.describe('narrow viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('shows a mobile syllabus toggle and the course image stays visible', async ({ page }) => {
    await page.goto('/#/courses/HIST111')
    await expect(page.getByRole('button', { name: 'Syllabus' })).toBeVisible()
    await expect(page.locator('.viewer-hero-image')).toBeVisible()
  })

  test('catalog cards stack in a single column layout', async ({ page }) => {
    await page.goto('/')
    const firstCard = page.locator('.course-card').first()
    const secondCard = page.locator('.course-card').nth(1)
    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()
    expect(secondBox.y).toBeGreaterThan(firstBox.y)
  })
})
