import { expect, Page } from '@playwright/test';

export type Viewport = { name: string; width: number; height: number };

// screen sizes the dashboard must look right on (see docs/QA.md)
export const VIEWPORTS: Viewport[] = [
	{ name: 'phone-small', width: 320, height: 568 },
	{ name: 'phone', width: 375, height: 812 },
	{ name: 'phone-landscape', width: 667, height: 375 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'tablet-landscape', width: 1024, height: 768 },
	{ name: 'laptop', width: 1440, height: 900 },
	{ name: 'desktop', width: 1920, height: 1080 },
	{ name: 'desktop-2k', width: 2560, height: 1440 },
];

// the dashboard fits one screen only when the screen is big enough;
// phones and short screens scroll vertically instead
export const fitsOneScreen = (viewport: Viewport) =>
	viewport.width > 600 && viewport.height > 700;

export const SELECTORS = {
	header: '.header',
	logo: '.header-logo',
	dropdown: '.dropdown',
	mainImage: '.picture img',
	prev: '.dashboard__section-1 > .inline >> nth=0',
	next: '.dashboard__section-1 > .inline >> nth=1',
	info: '.info',
	stats: '.stats',
	message: '.pokemon-message',
};

export const openDashboard = async (page: Page) => {
	await page.goto('./');
	await expect(page.locator('.dropdown__input')).toBeVisible();
};

// pick a Pokemon from the header search, like a user would
export const selectPokemon = async (page: Page, name: string) => {
	await page.locator('.dropdown__btn').click();
	await page.locator('.dropdown__input').fill(name);
	const item = page.locator('.dropdown__item', { hasText: new RegExp(`^${name}$`) });
	if (await item.isVisible()) {
		await item.click();
	}
	await expectMainPokemon(page, name);
};

// the Main Pokemon is shown everywhere: artwork loaded and Info panel name
export const expectMainPokemon = async (page: Page, name: string) => {
	await expect(page.locator('.overlay')).toHaveCount(0);
	await expect(page.locator(SELECTORS.info)).toContainText(name, {
		ignoreCase: true,
	});
	await expect(page.locator(SELECTORS.mainImage)).toHaveClass(
		/picture__img--loaded/
	);
};
