import { useEffect, useState } from 'react';
import { getPicture } from 'util/pictureRetrival';
import { useAppSelector } from 'util/hooks';
import { Inline, InlineProps } from './Inline';

export const PrevPokemon = () => {
	const prevPokemonDetails: any = useAppSelector((state) => {
		return state.prevPokemon;
	});
	const [inlineProps, setInlineProps] = useState<InlineProps>({
		imgLocation: '',
		altString: 'pokeImg',
		isNextPokemon: false,
		pokemonId: 0,
	});

	useEffect(() => {
		if (prevPokemonDetails) {
			const loc: string =
				prevPokemonDetails.sprites.other['official-artwork']['front_default'];
			getPicture(loc).then((imgUrl) => {
				setInlineProps({
					...inlineProps,
					imgLocation: imgUrl,
					pokemonId: prevPokemonDetails.id,
				});
			});
		} else {
			setInlineProps({ ...inlineProps, imgLocation: '' });
		}
		// eslint-disable-next-line
	}, [prevPokemonDetails]);

	return <Inline {...inlineProps} />;
};
