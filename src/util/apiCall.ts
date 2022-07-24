import { pokeApi } from 'api/pokeApi';
import { bindActionCreators } from 'redux';
import { pokemonActions } from 'store/actions';
import { store } from 'store/store';

// set-up dispatch
// const dispatch = useAppDispatch();
// const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
// 	bindActionCreators(pokemonActions, dispatch);

const {
	fetchAllPokemon,
	fetchPokemonDetails,
	fetchPokemonSpecies,
	fetchPrevPokemonDetails,
	fetchNextPokemonDetails,
} = bindActionCreators(pokemonActions, store.dispatch);

export const getAllPokemon = (): void => {
	fetchAllPokemon();
};

export const getPokemonAndNeighborInfo = (id: number): void => {
	fetchPokemonDetails(id);
	fetchPrevPokemonDetails(id);
	fetchNextPokemonDetails(id);
	fetchPokemonSpecies(id);
};

export const getPokeball = async (): Promise<any> => {
	const url = 'https://pokeapi.co/api/v2/item/poke-ball/';
	const response = await pokeApi().get(url);
	return response.data;
};

export const getApiResponseFromUrl = async (url: string): Promise<any> => {
	const response = await pokeApi().get(url);
	return response.data;
};
