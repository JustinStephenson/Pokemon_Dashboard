import { bindActionCreators } from 'redux';
import { pokemonActions } from 'store/actions';
import { store } from 'store/store';

// set-up dispatch
// const dispatch = useAppDispatch();
// const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
// 	bindActionCreators(pokemonActions, dispatch);

const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
	bindActionCreators(pokemonActions, store.dispatch);

export const getAllPokemon = () => {
	fetchAllPokemon();
};

export const getPokemonDetailsById = (id: number): void => {
	fetchPokemonDetails(id);
	fetchPokemonSpecies(id);
};

export const getPokemonNeighbors = () => {
	getPrevPokemonDetails();
	getNextPokemonDetails();
};

const getPrevPokemonDetails = () => {
	//TODO: get details of prev Pokemon
};

const getNextPokemonDetails = () => {
	//TODO: get details of next Pokemon
};
