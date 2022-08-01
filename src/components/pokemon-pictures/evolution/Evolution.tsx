import React, { useEffect, useState } from 'react';
import { getIdFromUrl } from 'util/misc';
import { getPictureById } from 'util/pictureRetrival';
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
	const [evolutions, setEvolutions] = useState<JSX.Element[]>([]);

	useEffect(() => {
		setup().then((imgList) => {
			setEvolutions(imgList);
		});
	}, []);

	const setup = async (): Promise<JSX.Element[]> => {
		let pokemonSeq: number[] = setupSequence();
		let images: JSX.Element[] = [];
		let keyValue = 0;
		for (const seq of pokemonSeq) {
			await getPictureById(seq).then((imgUrl) => {
				if (seq === pokemonSeq[pokemonSeq.length - 1]) {
					images.push(
						<React.Fragment key={keyValue++}>
							<div className="evolution">
								<img src={imgUrl} alt="evolution" />
							</div>
						</React.Fragment>
					);
				} else {
					images.push(
						<React.Fragment key={keyValue++}>
							<div className="evolution">
								<img src={imgUrl} alt="evolution" />
							</div>
							<p className="evolution--arrow">&gt;</p>
						</React.Fragment>
					);
				}
			});
		}
		return images;
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
