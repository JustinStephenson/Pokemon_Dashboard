import { bindActionCreators } from 'redux';
import { pokemonActions } from 'store/actions';
import { store } from 'store/store';

// set-up dispatch
// const dispatch = useAppDispatch();
// const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
// 	bindActionCreators(pokemonActions, dispatch);

const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
	bindActionCreators(pokemonActions, store.dispatch);

export const getAllPokemon = (): void => {
	fetchAllPokemon();
};

export const getPokemonDetailsById = (id: number): void => {
	fetchPokemonDetails(id); // also gets prev and next pokemon details
	fetchPokemonSpecies(id);
};
