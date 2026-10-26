import { defineConfig } from '@playwright/test'

// PLAYWRIGHT_PORT lets multiple test files run against independent preview
// servers at once; artifacts land in the ignored tmp/playwright-<port> dir.
const port = Number(process.env.PLAYWRIGHT_PORT || 4300)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  outputDir: `./tmp/playwright-${port}/artifacts`,
  reporter: [['list'], ['html', { outputFolder: `./tmp/playwright-${port}/report`, open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run preview -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
