import { combineReducers } from 'redux';
import { Pokemon } from '../actions';
import pokemonAllReducer from './pokemonAllReducer';
import pokemonCountReducer from './pokemonCountReducer';

export type ReducerType = {
	pokemonCount: number;
	pokemonAll: Pokemon[];
};

export default combineReducers<ReducerType>({
	pokemonCount: pokemonCountReducer,
	pokemonAll: pokemonAllReducer,
});
