import {
	clearPreloadedImages,
	getArtworkUrl,
	getArtworkUrlById,
	preloadImage,
} from './pictureRetrival';

const ARTWORK_URL =
	'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';

// jsdom never loads images, so stand in for window.Image
class FakeImage {
	static created: FakeImage[] = [];
	static failNext = false;
	onload: () => void = () => {};
	onerror: () => void = () => {};
	decoding = '';
	private fail = FakeImage.failNext;

	constructor() {
		FakeImage.created.push(this);
		FakeImage.failNext = false;
	}

	set src(_url: string) {
		setTimeout(() => (this.fail ? this.onerror() : this.onload()));
	}
}

const RealImage = window.Image;

beforeEach(() => {
	FakeImage.created = [];
	clearPreloadedImages();
	(window as any).Image = FakeImage;
});

afterAll(() => {
	window.Image = RealImage;
});

describe('getArtworkUrl', () => {
	it('returns the official artwork url of a /pokemon response', () => {
		const details = {
			sprites: { other: { 'official-artwork': { front_default: ARTWORK_URL } } },
		};
		expect(getArtworkUrl(details)).toBe(ARTWORK_URL);
	});

	it('returns an empty string when the Pokemon has no artwork', () => {
		expect(getArtworkUrl({ sprites: { other: {} } })).toBe('');
		expect(getArtworkUrl(null)).toBe('');
	});
});

describe('getArtworkUrlById', () => {
	it('builds the same url PokeAPI returns for that id', () => {
		expect(getArtworkUrlById(25)).toBe(ARTWORK_URL);
	});
});

describe('preloadImage', () => {
	it('resolves once the image has loaded', async () => {
		await expect(preloadImage(ARTWORK_URL)).resolves.toBeUndefined();
		expect(FakeImage.created).toHaveLength(1);
	});

	it('downloads each url only once', async () => {
		await Promise.all([preloadImage(ARTWORK_URL), preloadImage(ARTWORK_URL)]);
		await preloadImage(ARTWORK_URL);
		expect(FakeImage.created).toHaveLength(1);
	});

	it('still resolves when the image fails, and allows a retry', async () => {
		FakeImage.failNext = true;
		await expect(preloadImage(ARTWORK_URL)).resolves.toBeUndefined();
		await preloadImage(ARTWORK_URL);
		expect(FakeImage.created).toHaveLength(2);
	});

	it('does nothing for an empty url', async () => {
		await preloadImage('');
		expect(FakeImage.created).toHaveLength(0);
	});
});
