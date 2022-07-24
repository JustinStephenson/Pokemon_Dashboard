import { pokeApi } from 'api/pokeApi';
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

export const getPokemonAndNeighborInfo = (id: number): void => {
	fetchPokemonDetails(id); // also gets prev and next pokemon details
	fetchPokemonSpecies(id);
};

export const getPokeball = async (): Promise<object> => {
	const url = 'https://pokeapi.co/api/v2/item/poke-ball/';
	const response = await pokeApi().get(url);
	return response.data;
};

export const getEvolutionChain = async (id: number) => {
	return null;
};
