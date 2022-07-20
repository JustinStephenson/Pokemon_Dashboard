import { useEffect, useState } from 'react';
import { getPicture } from 'shared/pictureRetrival';
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
	});

	useEffect(() => {
		if (prevPokemonDetails) {
			const loc: string = prevPokemonDetails.sprites['front_default'];
			getPicture(loc).then((imgUrl) => {
				setInlineProps({ ...inlineProps, imgLocation: imgUrl });
			});
		} else {
			setInlineProps({ ...inlineProps, imgLocation: '' });
		}
	}, [prevPokemonDetails]);

	return <Inline {...inlineProps} />;
};
