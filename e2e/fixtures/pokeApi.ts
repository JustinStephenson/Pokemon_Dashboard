import path from 'path';
import { Page, Route } from '@playwright/test';

// Saved, trimmed PokeAPI data (only the fields the dashboard reads) so the UI
// tests are fast, run offline and never flake on the real API.

const API = 'https://pokeapi.co/api/v2';
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites';

type FixturePokemon = {
	id: number;
	name: string;
	types: string[];
	chain: number;
	varieties?: { id: number; name: string }[];
};

export const POKEMON: FixturePokemon[] = [
	{ id: 1, name: 'bulbasaur', types: ['grass', 'poison'], chain: 1 },
	{ id: 2, name: 'ivysaur', types: ['grass', 'poison'], chain: 1 },
	{
		id: 3,
		name: 'venusaur',
		types: ['grass', 'poison'],
		chain: 1,
		varieties: [{ id: 10033, name: 'venusaur-mega' }],
	},
	{ id: 4, name: 'charmander', types: ['fire'], chain: 2 },
	{ id: 5, name: 'charmeleon', types: ['fire'], chain: 2 },
	{
		id: 6,
		name: 'charizard',
		types: ['fire', 'flying'],
		chain: 2,
		// more varieties than fit the box, like Pikachu's 15
		varieties: Array.from({ length: 12 }, (_, i) => ({
			id: 10100 + i,
			name: `charizard-form-${i + 1}`,
		})),
	},
];

// the last Pokemon in the fixture data, i.e. has no next Neighbour
export const LAST_POKEMON = POKEMON[POKEMON.length - 1];

export const artworkUrl = (id: number) =>
	`${SPRITES}/pokemon/other/official-artwork/${id}.png`;

const STAT_NAMES = [
	'hp',
	'attack',
	'defense',
	'special-attack',
	'special-defense',
	'speed',
];

const pokemonResponse = (id: number, name: string, types: string[]) => ({
	id,
	name,
	height: 7 + id,
	weight: 69 + id * 10,
	types: types.map((type, slot) => ({ slot: slot + 1, type: { name: type } })),
	abilities: [
		{ is_hidden: false, ability: { name: 'overgrow' } },
		{ is_hidden: true, ability: { name: 'chlorophyll' } },
	],
	stats: STAT_NAMES.map((stat, i) => ({
		base_stat: 40 + id * 5 + i * 10,
		stat: { name: stat },
	})),
	sprites: {
		front_default: `${SPRITES}/pokemon/${id}.png`,
		other: { 'official-artwork': { front_default: artworkUrl(id) } },
	},
});

const speciesResponse = (pokemon: FixturePokemon) => ({
	id: pokemon.id,
	name: pokemon.name,
	is_baby: false,
	is_legendary: false,
	is_mythical: false,
	evolution_chain: { url: `${API}/evolution-chain/${pokemon.chain}/` },
	varieties: [
		{
			is_default: true,
			pokemon: { name: pokemon.name, url: `${API}/pokemon/${pokemon.id}/` },
		},
		...(pokemon.varieties ?? []).map((variety) => ({
			is_default: false,
			pokemon: { name: variety.name, url: `${API}/pokemon/${variety.id}/` },
		})),
	],
	flavor_text_entries: [
		{
			flavor_text: `${pokemon.name} test description used by the UI tests.`,
			language: { name: 'en', url: '' },
			version: { name: 'red', url: '' },
		},
	],
});

const chainLink = (ids: number[]): any => {
	const [id, ...rest] = ids;
	const pokemon = POKEMON.find((p) => p.id === id)!;
	return {
		evolution_details: [],
		is_baby: false,
		species: { name: pokemon.name, url: `${API}/pokemon-species/${id}/` },
		evolves_to: rest.length ? [chainLink(rest)] : [],
	};
};

const evolutionChainResponse = (chain: number) => ({
	id: chain,
	baby_trigger_item: null,
	chain: chainLink(POKEMON.filter((p) => p.chain === chain).map((p) => p.id)),
});

const findVariety = (id: number) => {
	for (const pokemon of POKEMON) {
		const variety = pokemon.varieties?.find((v) => v.id === id);
		if (variety) {
			return pokemonResponse(variety.id, variety.name, pokemon.types);
		}
	}
	return null;
};

// answer a PokeAPI path (without the /api/v2 prefix), or null if unknown
const apiResponse = (apiPath: string, search: URLSearchParams): any => {
	const parts = apiPath.split('/').filter(Boolean);
	const [resource, idText] = parts;
	const id = Number(idText);

	if (resource === 'pokemon-species' && !idText) {
		return { count: POKEMON.length };
	}
	if (resource === 'pokemon' && !idText) {
		const limit = Number(search.get('limit') ?? POKEMON.length);
		return {
			count: POKEMON.length,
			results: POKEMON.slice(0, limit).map((p) => ({
				name: p.name,
				url: `${API}/pokemon/${p.id}/`,
			})),
		};
	}
	if (resource === 'item' && idText === 'poke-ball') {
		return { sprites: { default: `${SPRITES}/items/poke-ball.png` } };
	}

	const pokemon = POKEMON.find((p) => p.id === id);
	if (resource === 'pokemon') {
		return pokemon
			? pokemonResponse(pokemon.id, pokemon.name, pokemon.types)
			: findVariety(id);
	}
	if (resource === 'pokemon-species' && pokemon) {
		return speciesResponse(pokemon);
	}
	if (resource === 'evolution-chain') {
		return evolutionChainResponse(id);
	}
	return null;
};

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
// square stand-ins: large artwork and small pixel sprites
const ARTWORK_FILE = path.join(PUBLIC_DIR, 'logo512.png');
const SPRITE_FILE = path.join(PUBLIC_DIR, 'logo192.png');

export type MockPokeApiOptions = {
	// extra delay for a /pokemon/{id} response, to force out-of-order replies
	delayMs?: (apiPath: string) => number;
};

export type MockPokeApi = {
	// every PokeAPI path and image url the page requested, in order
	requests: string[];
};

export const mockPokeApi = async (
	page: Page,
	options: MockPokeApiOptions = {}
): Promise<MockPokeApi> => {
	const requests: string[] = [];

	await page.route(`${API}/**`, async (route: Route) => {
		const url = new URL(route.request().url());
		const apiPath = url.pathname.replace('/api/v2', '').replace(/\/$/, '');
		requests.push(apiPath);

		const delay = options.delayMs?.(apiPath) ?? 0;
		if (delay) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		const body = apiResponse(apiPath, url.searchParams);
		if (body === null) {
			await route.fulfill({ status: 404, json: { detail: 'Not found.' } });
			return;
		}
		await route.fulfill({
			json: body,
			headers: { 'Access-Control-Allow-Origin': '*' },
		});
	});

	await page.route(`${SPRITES}/**`, async (route: Route) => {
		const url = route.request().url();
		requests.push(url);
		await route.fulfill({
			path: url.includes('official-artwork') ? ARTWORK_FILE : SPRITE_FILE,
			contentType: 'image/png',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=3600',
			},
		});
	});

	return { requests };
};
