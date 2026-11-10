import { expect, test } from '@playwright/test';
import { artworkUrl, mockPokeApi } from './fixtures/pokeApi';
import { openDashboard, selectPokemon, SELECTORS, VIEWPORTS } from './helpers';

const PHONE = VIEWPORTS.find((v) => v.name === 'phone')!;
const DESKTOP = VIEWPORTS.find((v) => v.name === 'desktop')!;

for (const viewport of [PHONE, DESKTOP]) {
	test.describe(`images on ${viewport.name}`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		test.beforeEach(async ({ page }) => {
			await mockPokeApi(page);
			await openDashboard(page);
			await selectPokemon(page, 'ivysaur');
		});

		test('main artwork is loaded, fully visible and not stretched', async ({ page }) => {
			const main = page.locator(SELECTORS.mainImage);
			await expect(main).toHaveAttribute('src', artworkUrl(2));
			await expect(main).toHaveAttribute('width', '475');
			await expect(main).toHaveAttribute('height', '475');
			await expect(main).toHaveCSS('object-fit', 'contain');
			await expect(main).toHaveCSS('opacity', '1');

			const naturalWidth = await main.evaluate(
				(img: HTMLImageElement) => img.naturalWidth
			);
			expect(naturalWidth).toBeGreaterThan(0);

			const box = (await main.boundingBox())!;
			expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(2);
		});

		test('Neighbour artwork is loaded', async ({ page }) => {
			for (const selector of [SELECTORS.prev, SELECTORS.next]) {
				const img = page.locator(`${selector} >> img.img`);
				await expect(img).toBeVisible();
				const naturalWidth = await img.evaluate(
					(el: HTMLImageElement) => el.naturalWidth
				);
				expect(naturalWidth).toBeGreaterThan(0);
			}
		});

		test('pixel sprites stay crisp', async ({ page }) => {
			const sprite = page.locator(`${SELECTORS.message} img`).first();
			await expect(sprite).toHaveCSS('image-rendering', 'pixelated');
		});
	});
}
