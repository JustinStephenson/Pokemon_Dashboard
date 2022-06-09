import {
	FetchPokemonCountAction,
	FetchAllPokemonAction,
	FetchPokemonDetails,
} from './pokemon';

export enum ActionTypes {
	FETCH_POKEMON_COUNT,
	FETCH_ALL_POKEMON,
	FETCH_POKEMON_DETAILS,
}

export type Action =
	| FetchPokemonCountAction
	| FetchAllPokemonAction
	| FetchPokemonDetails;
