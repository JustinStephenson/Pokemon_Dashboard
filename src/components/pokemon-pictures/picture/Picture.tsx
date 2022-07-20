import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../util/hooks';
import { getPicture } from 'util/pictureRetrival';
import './Picture.scss';

export const Picture = () => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const [pokePic, setPokePic] = useState<string>('');

	useEffect(() => {
		if (pokemonDetails) {
			const loc: string = pokemonDetails.sprites['front_default'];
			getPicture(loc).then((imgUrl) => {
				setPokePic(imgUrl);
			});
		}
	}, [pokemonDetails]);

	return (
		<div className="picture">
			<img src={pokePic} />
		</div>
	);
};
