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
