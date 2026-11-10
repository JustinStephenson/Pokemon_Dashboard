import { useState } from 'react';
import { useAppSelector } from '../../../util/hooks';
import { ARTWORK_SIZE, getArtworkUrl } from 'util/pictureRetrival';
import './Picture.scss';

// fetchpriority is not in React 18.1's img types yet; spreading passes it through
const highPriority = { fetchpriority: 'high' };

export const Picture = () => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const [loadedSrc, setLoadedSrc] = useState<string>('');

	const pokePic: string = pokemonDetails ? getArtworkUrl(pokemonDetails) : '';

	const populatePic = (): JSX.Element | null => {
		if (pokePic) {
			return (
				<img
					// new element per Pokemon so the fade restarts on every switch
					key={pokePic}
					className={loadedSrc === pokePic ? 'picture__img--loaded' : ''}
					src={pokePic}
					alt="PokemonImg"
					width={ARTWORK_SIZE}
					height={ARTWORK_SIZE}
					decoding="async"
					{...highPriority}
					onLoad={() => setLoadedSrc(pokePic)}
				/>
			);
		}
		return null;
	};

	return <div className="picture">{populatePic()}</div>;
};
