// Intrinsic sizes of the PokeAPI images, used for <img width/height> so the
// browser reserves the right box before the image arrives (no layout jump).
export const ARTWORK_SIZE = 475;
export const SPRITE_SIZE = 96;

const ARTWORK_BASE_URL =
	'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Official artwork url from a /pokemon/{id} response
export const getArtworkUrl = (pokemonDetails: any): string => {
	return (
		pokemonDetails?.sprites?.other?.['official-artwork']?.front_default ?? ''
	);
};

// Official artwork url without needing the /pokemon/{id} response
export const getArtworkUrlById = (id: number): string => {
	return `${ARTWORK_BASE_URL}/${id}.png`;
};

const preloaded = new Map<string, Promise<void>>();

// Warm the browser image cache so a later <img src={url}> shows instantly.
// Never rejects: a failed preload just means the <img> loads it normally.
export const preloadImage = (url: string): Promise<void> => {
	if (!url) {
		return Promise.resolve();
	}
	const existing = preloaded.get(url);
	if (existing) {
		return existing;
	}

	const promise = new Promise<void>((resolve) => {
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => resolve();
		img.onerror = () => {
			preloaded.delete(url);
			resolve();
		};
		img.src = url;
	});
	preloaded.set(url, promise);
	return promise;
};

export const clearPreloadedImages = (): void => {
	preloaded.clear();
};
