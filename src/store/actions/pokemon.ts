import { pokeApi } from '../../api/pokeApi';
import { Action, ActionTypes } from './types';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ReducerType } from '../reducers';
import {
	getPokemonById,
	getPokemonSpeciesById,
	isLatestRequest,
} from '../pokemonCache';
import { getArtworkUrl, preloadImage } from '../../util/pictureRetrival';

export interface Pokemon {
	name: string;
	url: string;
}

export interface FetchPokemonCountAction {
	type: ActionTypes.FETCH_POKEMON_COUNT;
	payload: number;
}

export interface FetchAllPokemonAction {
	type: ActionTypes.FETCH_ALL_POKEMON;
	payload: Pokemon[];
}

export interface FetchPokemonDetails {
	type: ActionTypes.FETCH_POKEMON_DETAILS;
	// TODO: get rid of any, add full api return
	payload: any;
}

export interface FetchPrevPokemonDetails {
	type: ActionTypes.FETCH_PREV_POKEMON_DETAILS;
	// TODO: get rid of any, add full api return
	payload: any;
}

export interface FetchNextPokemonDetails {
	type: ActionTypes.FETCH_NEXT_POKEMON_DETAILS;
	// TODO: get rid of any, add full api return
	payload: any;
}

export interface FetchPokemonSpecies {
	type: ActionTypes.FETCH_POKEMON_SPECIES;
	// TODO: get rid of any, add full api return
	payload: any;
}

export const fetchPokemonCount = () => {
	return async (dispatch: Dispatch<Action>) => {
		const response = await pokeApi().get('/pokemon-species', {
			params: {
				limit: 0,
			},
		});

		dispatch<FetchPokemonCountAction>({
			type: ActionTypes.FETCH_POKEMON_COUNT,
			payload: response.data.count,
		});
	};
};

export const fetchAllPokemon = () => {
	return async (
		dispatch: ThunkDispatch<Action, any, Action>,
		getState: () => ReducerType
	) => {
		await dispatch(fetchPokemonCount());

		const response = await pokeApi().get('/pokemon', {
			// after pokemonCount the api gives different types/versions of same pokemon
			params: {
				limit: getState().pokemonCount,
			},
		});

		return dispatch<FetchAllPokemonAction>({
			type: ActionTypes.FETCH_ALL_POKEMON,
			payload: response.data.results,
		});
	};
};

// Fetch selected Pokemon details, and it's neighbors Pokemon details.
// Data comes from pokemonCache, so a Neighbour that is already loaded is
// reused instead of fetched again, and late responses (an older click) are
// ignored so every panel shows the same Pokemon.
export const fetchPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>) => {
		const details = await getPokemonById(id);
		if (!isLatestRequest(id)) {
			return;
		}

		dispatch<FetchPokemonDetails>({
			type: ActionTypes.FETCH_POKEMON_DETAILS,
			payload: details,
		});
	};
};

export const fetchPrevPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>) => {
		const prevId = id - 1;
		// check if there is a prev pokemon
		const details = prevId > 0 ? await getPokemonById(prevId) : null;
		if (!isLatestRequest(id)) {
			return;
		}

		dispatch<FetchPrevPokemonDetails>({
			type: ActionTypes.FETCH_PREV_POKEMON_DETAILS,
			payload: details,
		});

		if (details) {
			prefetchNeighbor(details, prevId - 1 > 0 ? prevId - 1 : null);
		}
	};
};

export const fetchNextPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>, getState: () => ReducerType) => {
		const nextId = id + 1;
		const pokemonCount = getState().pokemonCount;
		// check if there is a next pokemon
		const details =
			nextId <= pokemonCount ? await getPokemonById(nextId) : null;
		if (!isLatestRequest(id)) {
			return;
		}

		dispatch<FetchNextPokemonDetails>({
			type: ActionTypes.FETCH_NEXT_POKEMON_DETAILS,
			payload: details,
		});

		if (details) {
			prefetchNeighbor(details, nextId + 1 <= pokemonCount ? nextId + 1 : null);
		}
	};
};

export const fetchPokemonSpecies = (id: number) => {
	return async (dispatch: Dispatch<Action>) => {
		const species = await getPokemonSpeciesById(id);
		if (!isLatestRequest(id)) {
			return;
		}

		dispatch<FetchPokemonSpecies>({
			type: ActionTypes.FETCH_POKEMON_SPECIES,
			payload: species,
		});
	};
};

// Warm the cache for what a Neighbour click shows next: the Neighbour's
// species and pixel sprite, plus the details and artwork of the Pokemon beyond
// it (the new Neighbour after the click). Failures are ignored; the real
// fetch retries.
const prefetchNeighbor = (neighborDetails: any, beyondId: number | null) => {
	getPokemonSpeciesById(neighborDetails.id).catch(() => {});
	preloadImage(neighborDetails.sprites?.front_default ?? '');
	if (beyondId) {
		getPokemonById(beyondId)
			.then((details) => preloadImage(getArtworkUrl(details)))
			.catch(() => {});
	}
};
