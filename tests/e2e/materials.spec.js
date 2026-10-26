import { test, expect } from '@playwright/test'

test.describe('persistent material viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/courses/HIST111')
  })

  test('shows the course image by default', async ({ page }) => {
    await expect(page.locator('.viewer-hero-image')).toHaveAttribute('src', /caravan/i)
    await expect(page.getByText('Select any item in the syllabus to open it here.')).toBeVisible()
  })

  test('selecting the PDF reading opens it in the viewer without navigating away', async ({ page }) => {
    await page.getByRole('button', { name: 'Lecture Notes: What Were the Silk Roads?' }).click()
    await expect(page).toHaveURL(/#\/courses\/HIST111$/)
    await expect(page.getByRole('heading', { name: 'Lecture Notes: What Were the Silk Roads?' })).toBeVisible()
    await expect(page.locator('iframe.material-frame')).toHaveAttribute('src', /\.pdf$/)
  })

  test('selecting the lecture video opens a native video player', async ({ page }) => {
    await page.getByRole('button', { name: 'Lecture Video: What Were the Silk Roads?' }).click()
    await expect(page).toHaveURL(/#\/courses\/HIST111$/)
    await expect(page.locator('video.material-video')).toHaveAttribute('src', /\.mp4$/)
    await expect(page.locator('video.material-video')).toHaveAttribute('controls', '')
  })

  test('selecting the YouTube link opens a privacy-enhanced embed', async ({ page }) => {
    await page.getByRole('button', { name: 'The Silk Road and Ancient Trade: Crash Course World History #9' }).click()
    await expect(page).toHaveURL(/#\/courses\/HIST111$/)
    await expect(page.locator('iframe.material-frame--youtube')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//)
  })

  test('selecting the Markdown assignment renders its instructions and grading table', async ({ page }) => {
    await page.getByRole('button', { name: 'Assignment: Mapping the Silk Roads' }).click()
    await expect(page).toHaveURL(/#\/courses\/HIST111$/)
    await expect(page.getByRole('heading', { name: 'Assignment: Mapping the Silk Roads', level: 2 })).toBeVisible()
    await expect(page.getByText('Write 500–700 words responding to the prompt below.')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Historical accuracy' })).toBeVisible()
    await expect(page.getByRole('cell', { name: '100', exact: true })).toBeVisible()
  })

  test('the active material chip is visually marked as selected', async ({ page }) => {
    const chip = page.getByRole('button', { name: 'Lecture Notes: What Were the Silk Roads?' })
    await chip.click()
    await expect(chip).toHaveClass(/material-chip--active/)
  })

  test('"back to course image" restores the default hero view', async ({ page }) => {
    await page.getByRole('button', { name: 'Lecture Notes: What Were the Silk Roads?' }).click()
    await page.getByRole('button', { name: 'Back to course image' }).click()
    await expect(page.locator('.viewer-hero-image')).toBeVisible()
    await expect(page.getByText('Select any item in the syllabus to open it here.')).toBeVisible()
  })

  test('switching between two materials replaces the viewer each time', async ({ page }) => {
    await page.getByRole('button', { name: 'Lecture Notes: What Were the Silk Roads?' }).click()
    await expect(page.locator('iframe.material-frame')).toHaveCount(1)
    await page.getByRole('button', { name: 'Lecture Video: What Were the Silk Roads?' }).click()
    await expect(page.locator('video.material-video')).toHaveCount(1)
    await expect(page.locator('iframe.material-frame')).toHaveCount(0)
  })
})
