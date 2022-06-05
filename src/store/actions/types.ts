import { FetchPokemonCountAction, FetchAllPokemonAction } from './pokemon';

export enum ActionTypes {
	FETCH_POKEMON_COUNT,
	FETCH_ALL_POKEMON,
}

export type Action = FetchPokemonCountAction | FetchAllPokemonAction;
