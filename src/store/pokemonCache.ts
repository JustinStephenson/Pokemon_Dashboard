import { pokeApi } from '../api/pokeApi';

// PokeAPI data never changes during a session, so each GET is made at most
// once. Caching the promise also de-duplicates requests that are in flight.
const responses = new Map<string, Promise<any>>();

export const cachedGet = (path: string): Promise<any> => {
	const existing = responses.get(path);
	if (existing) {
		return existing;
	}

	const request = pokeApi()
		.get(path)
		.then((response) => response.data)
		.catch((error) => {
			// allow a retry after a failed request
			responses.delete(path);
			throw error;
		});
	responses.set(path, request);
	return request;
};

export const getPokemonById = (id: number): Promise<any> => {
	return cachedGet(`/pokemon/${id}`);
};

export const getPokemonSpeciesById = (id: number): Promise<any> => {
	return cachedGet(`/pokemon-species/${id}`);
};

// The Main Pokémon the user asked for most recently. Responses for any other
// id arrived late (e.g. after fast clicking) and must not update the screen.
let latestRequestedId = 0;

export const setLatestRequestedId = (id: number): void => {
	latestRequestedId = id;
};

export const isLatestRequest = (id: number): boolean => {
	return id === latestRequestedId;
};

export const clearPokemonCache = (): void => {
	responses.clear();
	latestRequestedId = 0;
};
