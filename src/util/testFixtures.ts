// Minimal PokeAPI responses for unit tests (only the fields the app reads)
import { getArtworkUrlById } from './pictureRetrival';

export const makePokemon = (id: number): any => ({
	id,
	name: `pokemon-${id}`,
	sprites: {
		front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
		other: { 'official-artwork': { front_default: getArtworkUrlById(id) } },
	},
});

export const makeSpecies = (id: number): any => ({
	id,
	evolution_chain: { url: `https://pokeapi.co/api/v2/evolution-chain/${id}/` },
	varieties: [{ is_default: true, pokemon: { name: `pokemon-${id}`, url: '' } }],
	flavor_text_entries: [],
});

// Answers pokeApi().get(path) like PokeAPI would, for /pokemon/{id} and
// /pokemon-species/{id}
export const fakePokeApiGet = (path: string): Promise<{ data: any }> => {
	const pokemon = path.match(/^\/pokemon\/(\d+)$/);
	if (pokemon) {
		return Promise.resolve({ data: makePokemon(Number(pokemon[1])) });
	}
	const species = path.match(/^\/pokemon-species\/(\d+)$/);
	if (species) {
		return Promise.resolve({ data: makeSpecies(Number(species[1])) });
	}
	return Promise.reject(new Error(`unexpected request ${path}`));
};

// let every pending promise / thunk settle
export const flushPromises = async (): Promise<void> => {
	for (let i = 0; i < 10; i++) {
		await new Promise((resolve) => setTimeout(resolve, 0));
	}
};
