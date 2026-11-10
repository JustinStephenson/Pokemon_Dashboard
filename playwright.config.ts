import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
// CRA serves the app under the "homepage" path from package.json
const BASE_URL = `http://localhost:${PORT}/Pokemon_Dashboard/`;

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: BASE_URL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// optional: PW_CHANNEL=chrome uses the installed Google Chrome
				// instead of Playwright's downloaded Chromium
				channel: process.env.PW_CHANNEL || undefined,
			},
		},
	],
	webServer: {
		command: 'npm start',
		url: BASE_URL,
		env: { BROWSER: 'none', PORT: String(PORT) },
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
