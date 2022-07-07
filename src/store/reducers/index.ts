import { combineReducers } from 'redux';
import { Pokemon } from '../actions';
import pokemonAllReducer from './pokemonAllReducer';
import pokemonCountReducer from './pokemonCountReducer';
import pokemonDetailsReducer from './pokemonDetailsReducer';
import pokemonSpeciesReducer from './pokemonSpeciesReducer';

export type ReducerType = {
	pokemonCount: number;
	pokemonAll: Pokemon[];
	// TODO: change any types to a type when it is created in store/actions/pokemon.ts
	pokemonDetails: any;
	pokemonSpecies: any;
};

export default combineReducers<ReducerType>({
	pokemonCount: pokemonCountReducer,
	pokemonAll: pokemonAllReducer,
	pokemonDetails: pokemonDetailsReducer,
	pokemonSpecies: pokemonSpeciesReducer,
});
