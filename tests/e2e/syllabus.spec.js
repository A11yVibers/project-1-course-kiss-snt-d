import { test, expect } from '@playwright/test'

test.describe('Silk Roads course page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/courses/HIST111')
  })

  test('shows course information and instructor details from the data files', async ({ page }) => {
    await expect(page.getByText('HIST111')).toBeVisible()
    await expect(page.getByText(/Explore the Silk Roads as a changing network/)).toBeVisible()
    await expect(page.getByText('5 weeks')).toBeVisible()
    await expect(page.getByText('10 classes')).toBeVisible()
    await expect(page.getByText('Dr. Leila Rahman')).toBeVisible()
    await expect(page.getByRole('link', { name: 'leila.rahman@historyplatform.edu' })).toHaveAttribute(
      'href',
      'mailto:leila.rahman@historyplatform.edu',
    )
  })

  test('the syllabus table lists all 10 classes with week and date', async ({ page }) => {
    const rows = page.locator('.syllabus-table tbody tr')
    await expect(rows).toHaveCount(10)
    await expect(page.getByText('Class 1: What Were the Silk Roads?')).toBeVisible()
    await expect(page.getByText('Class 10: Maritime Routes and the Legacy of the Silk Roads')).toBeVisible()
    await expect(page.getByText('Mon, 21 Sept 2026')).toBeVisible()
  })

  test('class 1 and class 2 list their materials, later classes say materials are coming soon', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Lecture Notes: What Were the Silk Roads?' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lecture Video: What Were the Silk Roads?' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'The Silk Road and Ancient Trade: Crash Course World History #9' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Assignment: Mapping the Silk Roads' })).toBeVisible()

    const comingSoonCount = await page.getByText('Materials for this class are coming soon.').count()
    expect(comingSoonCount).toBe(8)
  })

  test('back to catalog link returns to the course grid', async ({ page }) => {
    await page.getByRole('link', { name: 'All courses' }).click()
    await expect(page).toHaveURL(/#\/$|\/$/)
    await expect(page.locator('.course-card')).toHaveCount(12)
  })

  test('a course with no materials shows "coming soon" for every class', async ({ page }) => {
    await page.goto('/#/courses/HIST101')
    await expect(page.getByRole('heading', { name: 'Ancient Egypt: Pharaohs, Pyramids, and Daily Life', level: 1 })).toBeVisible()
    const comingSoonCount = await page.getByText('Materials for this class are coming soon.').count()
    expect(comingSoonCount).toBe(10)
  })

  test('an unknown course id shows a not-found page with a way back', async ({ page }) => {
    await page.goto('/#/courses/HIST999')
    await expect(page.getByRole('heading', { name: 'Course not found' })).toBeVisible()
    await page.getByRole('link', { name: 'Back to catalog' }).click()
    await expect(page.locator('.course-card')).toHaveCount(12)
  })
})
