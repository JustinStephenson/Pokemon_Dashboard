import { expect, Page, test } from '@playwright/test';
import { artworkUrl, LAST_POKEMON, mockPokeApi, POKEMON } from './fixtures/pokeApi';
import {
	expectMainPokemon,
	openDashboard,
	selectPokemon,
	SELECTORS,
} from './helpers';

const neighbourImage = (page: Page, selector: string) =>
	page.locator(`${selector} >> img.img`);

test('Next shows the Neighbour as the Main Pokemon without fetching it again', async ({ page }) => {
	const api = await mockPokeApi(page);
	await openDashboard(page);
	await selectPokemon(page, 'bulbasaur');
	await expect(neighbourImage(page, SELECTORS.next)).toHaveAttribute(
		'src',
		artworkUrl(2)
	);
	// let the prefetch of the Pokemon beyond the Neighbour finish
	await page.waitForLoadState('networkidle');
	api.requests.length = 0;

	await page.locator(SELECTORS.next).click();

	await expectMainPokemon(page, 'ivysaur');
	await expect(page.locator(SELECTORS.mainImage)).toHaveAttribute(
		'src',
		artworkUrl(2)
	);
	await expect(neighbourImage(page, SELECTORS.prev)).toHaveAttribute(
		'src',
		artworkUrl(1)
	);
	await expect(neighbourImage(page, SELECTORS.next)).toHaveAttribute(
		'src',
		artworkUrl(3)
	);
	// ivysaur, its species and both Neighbours were already loaded or
	// prefetched, and its artwork was already on screen
	expect(api.requests).not.toContain('/pokemon/1');
	expect(api.requests).not.toContain('/pokemon/2');
	expect(api.requests).not.toContain('/pokemon/3');
	expect(api.requests).not.toContain('/pokemon-species/2');
	expect(api.requests).not.toContain(artworkUrl(2));
});

test('Prev shows the previous Pokemon', async ({ page }) => {
	await mockPokeApi(page);
	await openDashboard(page);
	await selectPokemon(page, 'charmander');

	await page.locator(SELECTORS.prev).click();

	await expectMainPokemon(page, 'venusaur');
});

test('fast clicking ends with every panel on the same Pokemon', async ({ page }) => {
	// earlier Pokemon answer slower, so responses arrive out of order
	await mockPokeApi(page, {
		delayMs: (apiPath) => {
			const id = Number(apiPath.split('/')[2]);
			return Number.isNaN(id) ? 0 : (POKEMON.length - id) * 120;
		},
	});
	await openDashboard(page);
	await selectPokemon(page, 'bulbasaur');

	for (let i = 0; i < 5; i++) {
		await page.locator(SELECTORS.next).click({ force: true });
		await page.waitForTimeout(80);
	}
	await page.waitForLoadState('networkidle');

	const mainSrc = (await page.locator(SELECTORS.mainImage).getAttribute('src'))!;
	const mainId = Number(mainSrc.match(/(\d+)\.png$/)![1]);
	const main = POKEMON.find((p) => p.id === mainId)!;

	await expectMainPokemon(page, main.name);
	await expect(neighbourImage(page, SELECTORS.prev)).toHaveAttribute(
		'src',
		artworkUrl(mainId - 1)
	);
	if (mainId < LAST_POKEMON.id) {
		await expect(neighbourImage(page, SELECTORS.next)).toHaveAttribute(
			'src',
			artworkUrl(mainId + 1)
		);
	}
});

test('the first Pokemon has no previous Neighbour', async ({ page }) => {
	await mockPokeApi(page);
	await openDashboard(page);
	await selectPokemon(page, 'bulbasaur');

	await expect(neighbourImage(page, SELECTORS.prev)).toHaveCount(0);
	await page.locator(SELECTORS.prev).click();
	await expectMainPokemon(page, 'bulbasaur');
});

test('the last Pokemon has no next Neighbour', async ({ page }) => {
	const api = await mockPokeApi(page);
	await openDashboard(page);
	await selectPokemon(page, LAST_POKEMON.name);

	await expect(neighbourImage(page, SELECTORS.next)).toHaveCount(0);
	expect(api.requests).not.toContain(`/pokemon/${LAST_POKEMON.id + 1}`);
});

test('Evolution and Variates views open and go back', async ({ page }) => {
	await mockPokeApi(page);
	await openDashboard(page);
	await selectPokemon(page, 'venusaur');

	await page.getByRole('button', { name: 'Evolution' }).click();
	await expect(page.getByAltText('evolution')).toHaveCount(3);
	await page.getByRole('button', { name: 'Go Back' }).click();
	await expect(page.locator(SELECTORS.mainImage)).toBeVisible();

	await page.getByRole('button', { name: 'Variates' }).click();
	await expect(page.getByAltText('variety')).toHaveCount(1);
	await expect(page.getByText('venusaur-mega')).toBeVisible();
});
