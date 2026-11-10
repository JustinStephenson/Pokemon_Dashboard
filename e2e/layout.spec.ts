import { expect, Page, test } from '@playwright/test';
import { mockPokeApi } from './fixtures/pokeApi';
import {
	fitsOneScreen,
	openDashboard,
	selectPokemon,
	SELECTORS,
	VIEWPORTS,
} from './helpers';

type Box = { x: number; y: number; width: number; height: number };

const boxOf = async (page: Page, selector: string): Promise<Box> => {
	const box = await page.locator(selector).boundingBox();
	expect(box, `${selector} should be rendered`).not.toBeNull();
	return box!;
};

// boxes in page coordinates (boundingBox is relative to the viewport)
const pageBoxOf = async (page: Page, selector: string): Promise<Box> => {
	const box = await boxOf(page, selector);
	const scrollY = await page.evaluate(() => window.scrollY);
	return { ...box, y: box.y + scrollY };
};

const overlaps = (a: Box, b: Box) =>
	a.x < b.x + b.width - 1 &&
	b.x < a.x + a.width - 1 &&
	a.y < b.y + b.height - 1 &&
	b.y < a.y + a.height - 1;

for (const viewport of VIEWPORTS) {
	test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		test.beforeEach(async ({ page }) => {
			await mockPokeApi(page);
			await openDashboard(page);
			await selectPokemon(page, 'ivysaur');
		});

		test('has no horizontal scrolling', async ({ page }) => {
			const { scrollWidth, innerWidth } = await page.evaluate(() => ({
				scrollWidth: document.documentElement.scrollWidth,
				innerWidth: window.innerWidth,
			}));
			expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
		});

		test('shows every panel inside the screen width', async ({ page }) => {
			for (const [name, selector] of Object.entries(SELECTORS)) {
				await expect(page.locator(selector), name).toBeVisible();
				const box = await boxOf(page, selector);
				expect(box.x, `${name} left edge`).toBeGreaterThanOrEqual(0);
				expect(box.x + box.width, `${name} right edge`).toBeLessThanOrEqual(
					viewport.width
				);
			}
		});

		test('does not overlap or clip panels', async ({ page }) => {
			const panels = ['.header', '.dashboard__section-1', SELECTORS.info, SELECTORS.stats, SELECTORS.message];
			const boxes = await Promise.all(panels.map((p) => pageBoxOf(page, p)));
			for (let i = 0; i < panels.length; i++) {
				for (let j = i + 1; j < panels.length; j++) {
					expect(
						overlaps(boxes[i], boxes[j]),
						`${panels[i]} overlaps ${panels[j]}`
					).toBe(false);
				}
			}

			// content that doesn't fit its box would be cut off or spill out
			const clipped = await page.evaluate(() =>
				Array.from(
					document.querySelectorAll(
						'.info, .info__body > *, .stats, .pokemon-message, .message'
					)
				)
					.filter(
						(el) =>
							el.scrollHeight > el.clientHeight + 1 ||
							el.scrollWidth > el.clientWidth + 1
					)
					.map((el) => el.className)
			);
			expect(clipped).toEqual([]);
		});

		test('keeps the dashboard on one screen only when it fits', async ({ page }) => {
			const scrollHeight = await page.evaluate(
				() => document.documentElement.scrollHeight
			);
			if (fitsOneScreen(viewport)) {
				expect(scrollHeight).toBeLessThanOrEqual(viewport.height);
			} else {
				// phones / short screens scroll; the last panel must be reachable
				const message = await pageBoxOf(page, SELECTORS.message);
				expect(message.y + message.height).toBeLessThanOrEqual(scrollHeight);
			}
		});

		test('keeps prev | main | next in one row with the main image largest', async ({ page }) => {
			const prev = await boxOf(page, SELECTORS.prev);
			const main = await boxOf(page, SELECTORS.mainImage);
			const next = await boxOf(page, SELECTORS.next);

			expect(prev.x + prev.width).toBeLessThanOrEqual(main.x);
			expect(main.x + main.width).toBeLessThanOrEqual(next.x);
			const prevImage = await boxOf(page, `${SELECTORS.prev} >> img.img`);
			expect(main.width).toBeGreaterThan(prevImage.width);
		});

		test('has Neighbour buttons big enough to tap', async ({ page }) => {
			for (const selector of [SELECTORS.prev, SELECTORS.next]) {
				const box = await boxOf(page, selector);
				expect(box.width).toBeGreaterThanOrEqual(44);
				expect(box.height).toBeGreaterThanOrEqual(44);
			}
		});

		test('screenshot for visual review', async ({ page }, testInfo) => {
			// no pixel comparison: saved under test-results/ and attached to the
			// HTML report to eyeball
			const file = testInfo.outputPath(`${viewport.name}.png`);
			await page.screenshot({ path: file, fullPage: true });
			await testInfo.attach(`${viewport.name}.png`, {
				path: file,
				contentType: 'image/png',
			});
		});
	});
}
