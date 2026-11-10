import { expect, Page, test } from '@playwright/test';
import { mockPokeApi } from './fixtures/pokeApi';
import { openDashboard, selectPokemon, VIEWPORTS } from './helpers';

const openVariates = async (page: Page, name: string) => {
	await selectPokemon(page, name);
	await page.getByRole('button', { name: 'Variates' }).click();
	await expect(page.getByAltText('variety').first()).toBeVisible();
};

// left / right edges of the scroll box and of every variety card, measured
// with the box scrolled fully left and fully right
const measureVarieties = (page: Page) =>
	page.evaluate(async () => {
		const box = document.querySelector('.var-container') as HTMLElement;
		const cards = Array.from(box.querySelectorAll('.varieties'));
		const edges = () => {
			const b = box.getBoundingClientRect();
			return {
				box: { left: b.left, right: b.right },
				cards: cards.map((card) => {
					const c = card.getBoundingClientRect();
					const img = card.querySelector('img')!.getBoundingClientRect();
					return { left: c.left, right: c.right, imgLeft: img.left, imgRight: img.right };
				}),
			};
		};
		box.scrollLeft = 0;
		const atStart = edges();
		box.scrollLeft = box.scrollWidth;
		const atEnd = edges();
		box.scrollLeft = 0;
		return { atStart, atEnd, overflows: box.scrollWidth > box.clientWidth };
	});

for (const viewport of VIEWPORTS.filter((v) =>
	['phone', 'tablet', 'laptop'].includes(v.name)
)) {
	test.describe(`Variates on ${viewport.name}`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		test.beforeEach(async ({ page }) => {
			await mockPokeApi(page);
			await openDashboard(page);
		});

		test('every variety can be scrolled to when they do not fit', async ({ page }) => {
			await openVariates(page, 'charizard');
			await expect(page.getByAltText('variety')).toHaveCount(12);

			const { atStart, atEnd, overflows } = await measureVarieties(page);
			expect(overflows).toBe(true);

			// first card starts inside the box when scrolled to the start
			const first = atStart.cards[0];
			expect(first.left).toBeGreaterThanOrEqual(atStart.box.left - 1);
			// last card ends inside the box when scrolled to the end
			const last = atEnd.cards[atEnd.cards.length - 1];
			expect(last.right).toBeLessThanOrEqual(atEnd.box.right + 1);
			// and the scroll area ends with it, no empty space after it
			expect(atEnd.box.right - last.right).toBeLessThanOrEqual(1);

			// every image stays inside its own card
			for (const card of atStart.cards) {
				expect(card.imgLeft).toBeGreaterThanOrEqual(card.left - 1);
				expect(card.imgRight).toBeLessThanOrEqual(card.right + 1);
			}
		});

		test('each variety name is centred under its image', async ({ page }) => {
			await openVariates(page, 'charizard');

			const offsets = await page.evaluate(() =>
				Array.from(document.querySelectorAll('.varieties')).map((card) => {
					const img = card.querySelector('img')!.getBoundingClientRect();
					const name = card.querySelector('p')!.getBoundingClientRect();
					return {
						centre: Math.abs(
							img.left + img.width / 2 - (name.left + name.width / 2)
						),
						below: name.top - img.bottom,
					};
				})
			);
			for (const offset of offsets) {
				expect(offset.centre).toBeLessThanOrEqual(2);
				expect(offset.below).toBeGreaterThanOrEqual(-1);
			}
		});

		test('a single variety is centred', async ({ page }) => {
			await openVariates(page, 'venusaur');

			const { atStart, overflows } = await measureVarieties(page);
			expect(overflows).toBe(false);
			const card = atStart.cards[0];
			const boxCentre = (atStart.box.left + atStart.box.right) / 2;
			const cardCentre = (card.left + card.right) / 2;
			expect(Math.abs(boxCentre - cardCentre)).toBeLessThanOrEqual(2);
		});
	});
}
