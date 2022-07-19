import { useEffect, useState } from 'react';
import { getPicture } from 'shared/pictureRetrival';
import { useAppSelector } from 'util/hooks';
import { Inline, InlineProps } from './Inline';

export const NextPokemon = () => {
	const nextPokemonDetails: any = useAppSelector((state) => {
		return state.nextPokemon;
	});
	const [inlineProps, setInlineProps] = useState<InlineProps>({
		imgLocation: '',
		altString: 'pokeImg',
		isNextPokemon: true,
	});

	useEffect(() => {
		if (nextPokemonDetails) {
			const loc: string = nextPokemonDetails.sprites['front_default'];
			getPicture(loc).then((imgUrl) => {
				setInlineProps({ ...inlineProps, imgLocation: imgUrl });
			});
		}
	}, [nextPokemonDetails]);

	return <Inline {...inlineProps} />;
};
