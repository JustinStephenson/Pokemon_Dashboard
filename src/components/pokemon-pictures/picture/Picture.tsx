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
			const loc: string =
				pokemonDetails.sprites.other['official-artwork']['front_default'];
			getPicture(loc).then((imgUrl) => {
				setPokePic(imgUrl);
			});
		}
	}, [pokemonDetails]);

	const populatePic = (): JSX.Element | null => {
		if (pokePic) {
			return <img src={pokePic} alt="PokemonImg" />;
		}
		return null;
	};

	return <div className="picture">{populatePic()}</div>;
};
