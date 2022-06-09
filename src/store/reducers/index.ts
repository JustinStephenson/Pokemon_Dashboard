import { combineReducers } from 'redux';
import { Pokemon } from '../actions';
import pokemonAllReducer from './pokemonAllReducer';
import pokemonCountReducer from './pokemonCountReducer';
import pokemonDetailsReducer from './pokemonDetailsReducer';

export type ReducerType = {
	pokemonCount: number;
	pokemonAll: Pokemon[];
	pokemonDetails: any;
};

export default combineReducers<ReducerType>({
	pokemonCount: pokemonCountReducer,
	pokemonAll: pokemonAllReducer,
	pokemonDetails: pokemonDetailsReducer,
});
