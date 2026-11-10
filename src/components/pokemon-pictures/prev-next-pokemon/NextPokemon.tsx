import { getArtworkUrl } from 'util/pictureRetrival';
import { useAppSelector } from 'util/hooks';
import { Inline, InlineProps } from './Inline';

export const NextPokemon = () => {
	const nextPokemonDetails: any = useAppSelector((state) => {
		return state.nextPokemon;
	});

	// the artwork url is used directly, so the browser caches it and the
	// Main Pokemon shows instantly when this Neighbour is clicked
	const inlineProps: InlineProps = {
		imgLocation: nextPokemonDetails ? getArtworkUrl(nextPokemonDetails) : '',
		altString: 'pokeImg',
		isNextPokemon: true,
		pokemonId: nextPokemonDetails ? nextPokemonDetails.id : 0,
	};

	return <Inline {...inlineProps} />;
};
