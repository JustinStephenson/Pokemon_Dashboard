import { combineReducers } from 'redux';
import { Pokemon } from '../actions';
import pokemonAllReducer from './pokemonAllReducer';
import pokemonCountReducer from './pokemonCountReducer';
import pokemonDetailsReducer from './pokemonDetailsReducer';
import pokemonSpeciesReducer from './pokemonSpeciesReducer';
import prevPokemonReducer from './prevPokemonReducer';
import nextPokemonReducer from './nextPokemonReducer';

export type ReducerType = {
	pokemonCount: number;
	pokemonAll: Pokemon[];
	// TODO: change any types to a type when it is created in store/actions/pokemon.ts
	pokemonDetails: any;
	pokemonSpecies: any;
	prevPokemon: any;
	nextPokemon: any;
};

export default combineReducers<ReducerType>({
	pokemonCount: pokemonCountReducer,
	pokemonAll: pokemonAllReducer,
	pokemonDetails: pokemonDetailsReducer,
	pokemonSpecies: pokemonSpeciesReducer,
	prevPokemon: prevPokemonReducer,
	nextPokemon: nextPokemonReducer,
});
