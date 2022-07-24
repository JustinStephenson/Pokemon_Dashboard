import { pokeApi } from '../../api/pokeApi';
import { Action, ActionTypes } from './types';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ReducerType } from '../reducers';
import { AxiosResponse } from 'axios';

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

// Fetch selected Pokemon details, and it's neighbors Pokemon details
export const fetchPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>, getState: any) => {
		const currentPokemonResponse = await pokeApi().get(`/pokemon/${id}`);

		dispatch<FetchPokemonDetails>({
			type: ActionTypes.FETCH_POKEMON_DETAILS,
			payload: currentPokemonResponse.data,
		});
	};
};

export const fetchPrevPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>, getState: any) => {
		let prevPokemonResponse: AxiosResponse<any, any> | null = null;

		// check if there is a prev pokemon
		if (id - 1 !== 0) {
			prevPokemonResponse = await pokeApi().get(`/pokemon/${id - 1}`);
		}

		if (!!prevPokemonResponse) {
			dispatch<FetchPrevPokemonDetails>({
				type: ActionTypes.FETCH_PREV_POKEMON_DETAILS,
				payload: prevPokemonResponse.data,
			});
		} else {
			dispatch<FetchPrevPokemonDetails>({
				type: ActionTypes.FETCH_PREV_POKEMON_DETAILS,
				payload: null,
			});
		}
	};
};

export const fetchNextPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>, getState: any) => {
		let nextPokemonResponse: AxiosResponse<any, any> | null = null;

		// check if there is a next pokemon
		if (id + 1 <= getState().pokemonCount) {
			nextPokemonResponse = await pokeApi().get(`/pokemon/${id + 1}`);
		}

		if (!!nextPokemonResponse) {
			dispatch<FetchNextPokemonDetails>({
				type: ActionTypes.FETCH_NEXT_POKEMON_DETAILS,
				payload: nextPokemonResponse.data,
			});
		} else {
			dispatch<FetchNextPokemonDetails>({
				type: ActionTypes.FETCH_NEXT_POKEMON_DETAILS,
				payload: null,
			});
		}
	};
};

export const fetchPokemonSpecies = (id: number) => {
	return async (dispatch: Dispatch<Action>) => {
		const response = await pokeApi().get(`/pokemon-species/${id}`);

		dispatch<FetchPokemonSpecies>({
			type: ActionTypes.FETCH_POKEMON_SPECIES,
			payload: response.data,
		});
	};
};
