import { getPokemonAndNeighborInfo } from 'util/apiCall';
import { store } from 'store/store';
import { ActionTypes } from 'store/actions';
import { cachedGet, clearPokemonCache } from 'store/pokemonCache';
import { fakePokeApiGet, flushPromises } from 'util/testFixtures';

const mockGet = jest.fn();
jest.mock('api/pokeApi', () => ({
	pokeApi: () => ({ get: mockGet }),
}));

// images are not part of these tests
jest.mock('util/pictureRetrival', () => ({
	...jest.requireActual('util/pictureRetrival'),
	preloadImage: jest.fn(() => Promise.resolve()),
}));

const POKEMON_COUNT = 10;

const requestedPaths = (): string[] => mockGet.mock.calls.map((call) => call[0]);

beforeEach(() => {
	clearPokemonCache();
	mockGet.mockReset();
	mockGet.mockImplementation(fakePokeApiGet);
	store.dispatch({
		type: ActionTypes.FETCH_POKEMON_COUNT,
		payload: POKEMON_COUNT,
	});
});

describe('getPokemonAndNeighborInfo', () => {
	it('loads the Main Pokemon, its species and both Neighbours', async () => {
		getPokemonAndNeighborInfo(5);
		await flushPromises();

		const state = store.getState();
		expect(state.pokemonDetails.id).toBe(5);
		expect(state.pokemonSpecies.id).toBe(5);
		expect(state.prevPokemon.id).toBe(4);
		expect(state.nextPokemon.id).toBe(6);
	});

	it('reuses already loaded data when a Neighbour is clicked', async () => {
		getPokemonAndNeighborInfo(5);
		await flushPromises();
		mockGet.mockClear();

		// click the next Neighbour
		getPokemonAndNeighborInfo(6);
		await flushPromises();

		const state = store.getState();
		expect(state.pokemonDetails.id).toBe(6);
		expect(state.prevPokemon.id).toBe(5);
		expect(state.nextPokemon.id).toBe(7);
		// 6 and 5 were on screen, 7 and species 6 were prefetched
		expect(requestedPaths()).not.toContain('/pokemon/6');
		expect(requestedPaths()).not.toContain('/pokemon/5');
		expect(requestedPaths()).not.toContain('/pokemon/7');
		expect(requestedPaths()).not.toContain('/pokemon-species/6');
	});

	it('prefetches the Pokemon beyond each Neighbour', async () => {
		getPokemonAndNeighborInfo(5);
		await flushPromises();

		expect(requestedPaths()).toEqual(
			expect.arrayContaining([
				'/pokemon/3',
				'/pokemon/7',
				'/pokemon-species/4',
				'/pokemon-species/6',
			])
		);
	});

	it('ignores a late response for an older click', async () => {
		let resolveSlow: (value: any) => void = () => {};
		mockGet.mockImplementation((path: string) => {
			if (path === '/pokemon/1') {
				return new Promise((resolve) => {
					resolveSlow = resolve;
				});
			}
			return fakePokeApiGet(path);
		});

		getPokemonAndNeighborInfo(1);
		getPokemonAndNeighborInfo(3);
		await flushPromises();
		// the response for the first click arrives last
		resolveSlow(await fakePokeApiGet('/pokemon/1'));
		await flushPromises();

		const state = store.getState();
		expect(state.pokemonDetails.id).toBe(3);
		expect(state.pokemonSpecies.id).toBe(3);
		expect(state.prevPokemon.id).toBe(2);
		expect(state.nextPokemon.id).toBe(4);
	});

	it('has no previous Neighbour for the first Pokemon', async () => {
		getPokemonAndNeighborInfo(1);
		await flushPromises();

		expect(store.getState().prevPokemon).toBeNull();
		expect(requestedPaths()).not.toContain('/pokemon/0');
	});

	it('has no next Neighbour for the last Pokemon', async () => {
		getPokemonAndNeighborInfo(POKEMON_COUNT);
		await flushPromises();

		expect(store.getState().nextPokemon).toBeNull();
		expect(requestedPaths()).not.toContain(`/pokemon/${POKEMON_COUNT + 1}`);
	});
});

describe('cachedGet', () => {
	it('makes one request for the same path', async () => {
		await Promise.all([cachedGet('/pokemon/8'), cachedGet('/pokemon/8')]);
		await cachedGet('/pokemon/8');

		expect(mockGet).toHaveBeenCalledTimes(1);
	});

	it('retries a path after a failed request', async () => {
		mockGet.mockRejectedValueOnce(new Error('network down'));

		await expect(cachedGet('/pokemon/8')).rejects.toThrow('network down');
		await expect(cachedGet('/pokemon/8')).resolves.toMatchObject({ id: 8 });
		expect(mockGet).toHaveBeenCalledTimes(2);
	});
});
