import { bindActionCreators } from 'redux';
import { pokemonActions } from 'store/actions';
import { cachedGet, setLatestRequestedId } from 'store/pokemonCache';
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
	// only responses for the most recent request may update the dashboard
	setLatestRequestedId(id);
	fetchPokemonDetails(id);
	fetchPrevPokemonDetails(id);
	fetchNextPokemonDetails(id);
	fetchPokemonSpecies(id);
};

export const getPokeball = (): Promise<any> => {
	return cachedGet('https://pokeapi.co/api/v2/item/poke-ball/');
};

export const getApiResponseFromUrl = (url: string): Promise<any> => {
	return cachedGet(url);
};
