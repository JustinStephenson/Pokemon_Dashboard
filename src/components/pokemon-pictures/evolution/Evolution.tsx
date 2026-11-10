import { Spinner } from 'components/spinner/Spinner';
import React, { useEffect, useState } from 'react';
import { getIdFromUrl } from 'util/misc';
import {
	ARTWORK_SIZE,
	getArtworkUrlById,
	preloadImage,
} from 'util/pictureRetrival';
import './Evolution.scss';

export type EvolutionChain = {
	baby_trigger_item: string;
	chain: Chain;
	id: string;
};

type Chain = {
	evolution_details: object[];
	evolves_to: Chain[];
	is_baby: boolean;
	species: {
		name: string;
		url: string;
	};
};

export type EvolutionProps = {
	evolutionDetails: EvolutionChain | null;
};

export const Evolution = (props: EvolutionProps) => {
	const [evolutions, setEvolutions] = useState<JSX.Element[]>([
		<Spinner key={'spinner'}></Spinner>,
	]);

	useEffect(() => {
		setup().then((imgList) => {
			setEvolutions(imgList);
		});
	}, []);

	const setup = async (): Promise<JSX.Element[]> => {
		const pokemonSeq: number[] = setupSequence();
		const imgUrls: string[] = pokemonSeq.map((id) => getArtworkUrlById(id));
		// load every evolution image at the same time, not one after another
		await Promise.all(imgUrls.map((url) => preloadImage(url)));

		return imgUrls.map((imgUrl, index) => {
			const isLast = index === imgUrls.length - 1;
			return (
				<React.Fragment key={index}>
					<div className="evolution">
						<img
							src={imgUrl}
							alt="evolution"
							width={ARTWORK_SIZE}
							height={ARTWORK_SIZE}
							decoding="async"
						/>
					</div>
					{isLast ? null : <p className="evolution--arrow">&gt;</p>}
				</React.Fragment>
			);
		});
	};

	const setupSequence = (): number[] => {
		let result: number[] = [];
		if (props.evolutionDetails) {
			let currentChain: Chain = props.evolutionDetails.chain;
			result.push(getIdFromUrl(currentChain.species.url));
			while (currentChain.evolves_to.length > 0) {
				// get next sequence in current chain
				currentChain = currentChain.evolves_to[0];
				// set the values of pokemonSeq
				result.push(getIdFromUrl(currentChain.species.url));
			}
		}
		return result;
	};

	return <React.Fragment>{evolutions}</React.Fragment>;
};
