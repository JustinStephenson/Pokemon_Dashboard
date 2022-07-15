import {
	FetchPokemonCountAction,
	FetchAllPokemonAction,
	FetchPokemonDetails,
	FetchPokemonSpecies,
	FetchPrevPokemonDetails,
	FetchNextPokemonDetails,
} from './pokemon';

export enum ActionTypes {
	FETCH_POKEMON_COUNT,
	FETCH_ALL_POKEMON,
	FETCH_POKEMON_DETAILS,
	FETCH_PREV_POKEMON_DETAILS,
	FETCH_NEXT_POKEMON_DETAILS,
	FETCH_POKEMON_SPECIES,
}

export type Action =
	| FetchPokemonCountAction
	| FetchAllPokemonAction
	| FetchPokemonDetails
	| FetchPokemonSpecies
	| FetchPrevPokemonDetails
	| FetchNextPokemonDetails;
