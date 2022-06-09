import { useEffect, useState } from 'react';
import { pokeApi } from '../../api/pokeApi';
import { useAppSelector } from '../../util/hooks';
import './Picture.scss';

export type PictureProps = {};

export const Picture = (props: PictureProps) => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const [pokePic, setPokePic] = useState<any>('');

	useEffect(() => {
		if (pokemonDetails) {
			const loc: string = pokemonDetails.sprites['front_default'];
			const apiRequest = async () => {
				const response = await pokeApi().get(loc, {
					responseType: 'arraybuffer',
				});
				setPokePic(URL.createObjectURL(new Blob([response.data])));
			};
			apiRequest();
		}
	}, [pokemonDetails]);

	return (
		<div className="picture">
			<img src={pokePic} />
		</div>
	);
};
