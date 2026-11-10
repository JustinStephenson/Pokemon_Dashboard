import { expect, Page, test } from '@playwright/test';
import { mockPokeApi } from './fixtures/pokeApi';
import { openDashboard, selectPokemon, VIEWPORTS } from './helpers';

// The Evolution and Variates views replace the main image (AdvancedDisplay)
const PHONES = VIEWPORTS.filter((v) => ['phone-small', 'phone'].includes(v.name));

const box = async (page: Page, selector: string) => {
	const b = await page.locator(selector).first().boundingBox();
	expect(b, `${selector} should be rendered`).not.toBeNull();
	return b!;
};

for (const viewport of PHONES) {
	test.describe(`Evolution / Variates on ${viewport.name}`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		test.beforeEach(async ({ page }) => {
			await mockPokeApi(page);
			await openDashboard(page);
			await selectPokemon(page, 'venusaur');
		});

		for (const view of ['Evolution', 'Variates']) {
			test(`${view} uses the full width between the Neighbours`, async ({ page }, testInfo) => {
				const container = await box(page, '.dashboard__section-1 .container');
				await page.getByRole('button', { name: view }).click();
				await expect(page.getByRole('button', { name: 'Go Back' })).toBeVisible();

				const panel = await box(page, '.advanced-display-content');
				expect(panel.width).toBeGreaterThanOrEqual(container.width - 1);

				const goBack = await box(page, '.advanced-display .button');
				const goBackCentre = goBack.x + goBack.width / 2;
				expect(Math.abs(goBackCentre - (panel.x + panel.width / 2))).toBeLessThanOrEqual(2);

				const file = testInfo.outputPath(`${view}-${viewport.name}.png`);
				await page.locator('.dashboard__section-1').screenshot({ path: file });
				await testInfo.attach(`${view}-${viewport.name}.png`, {
					path: file,
					contentType: 'image/png',
				});
			});
		}

		test('evolution images are a usable size and inside the panel', async ({ page }) => {
			await page.getByRole('button', { name: 'Evolution' }).click();
			await expect(page.getByAltText('evolution')).toHaveCount(3);

			const panel = await box(page, '.advanced-display-content');
			const images = page.locator('.evolution');
			for (let i = 0; i < 3; i++) {
				const image = (await images.nth(i).boundingBox())!;
				expect(image.width).toBeGreaterThanOrEqual(45);
				expect(image.x).toBeGreaterThanOrEqual(panel.x);
				expect(image.x + image.width).toBeLessThanOrEqual(panel.x + panel.width);
			}
		});

		test('variety cards are a usable size with readable names', async ({ page }) => {
			await page.getByRole('button', { name: 'Variates' }).click();
			await expect(page.getByAltText('variety')).toHaveCount(1);

			const image = await box(page, '.varieties img');
			expect(image.width).toBeGreaterThanOrEqual(70);
			await expect(page.locator('.varieties p')).toHaveCSS('font-size', '11px');
		});
	});
}
