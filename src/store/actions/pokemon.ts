import { pokeApi } from '../../api/pokeApi';
import { Action, ActionTypes } from './types';
import { Dispatch } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { ReducerType } from '../reducers';

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

export const fetchPokemonDetails = (id: number) => {
	return async (dispatch: Dispatch<Action>) => {
		const response = await pokeApi().get(`/pokemon/${id}`);

		dispatch<FetchPokemonDetails>({
			type: ActionTypes.FETCH_POKEMON_DETAILS,
			payload: response.data,
		});
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
