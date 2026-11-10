import { getArtworkUrl } from 'util/pictureRetrival';
import { useAppSelector } from 'util/hooks';
import { Inline, InlineProps } from './Inline';

export const PrevPokemon = () => {
	const prevPokemonDetails: any = useAppSelector((state) => {
		return state.prevPokemon;
	});

	// the artwork url is used directly, so the browser caches it and the
	// Main Pokemon shows instantly when this Neighbour is clicked
	const inlineProps: InlineProps = {
		imgLocation: prevPokemonDetails ? getArtworkUrl(prevPokemonDetails) : '',
		altString: 'pokeImg',
		isNextPokemon: false,
		pokemonId: prevPokemonDetails ? prevPokemonDetails.id : 0,
	};

	return <Inline {...inlineProps} />;
};
