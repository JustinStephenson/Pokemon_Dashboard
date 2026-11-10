import React from 'react';
import arrowImg from 'img/arrow/arrow_transparent.png';
import { getPokemonAndNeighborInfo } from 'util/apiCall';
import { ARTWORK_SIZE } from 'util/pictureRetrival';
import './Inline.scss';

export type InlineProps = {
	imgLocation: string;
	altString: string;
	isNextPokemon: boolean; // if next pokemon or previous pokemon
	pokemonId: number;
};

export const Inline = (props: InlineProps) => {
	const image = (): JSX.Element => {
		return (
			<img
				key="img"
				className="img"
				src={props.imgLocation}
				alt={props.altString}
				width={ARTWORK_SIZE}
				height={ARTWORK_SIZE}
				decoding="async"
			/>
		);
	};

	const arrow = (): JSX.Element => {
		return (
			<img
				key="arrow"
				className={props.isNextPokemon ? 'arrow-flipped' : 'arrow'}
				src={arrowImg}
				alt="arrow"
			/>
		);
	};

	const clicked = () => {
		// an empty Neighbour (before #1 / after the last) has nothing to show
		if (props.imgLocation && props.pokemonId) {
			getPokemonAndNeighborInfo(props.pokemonId);
		}
	};

	const populate = (): JSX.Element => {
		let result: JSX.Element[] = [];
		if (props.imgLocation) {
			if (props.isNextPokemon) {
				result.push(image());
				result.push(arrow());
			} else {
				result.push(arrow());
				result.push(image());
			}
		} else {
			// preserve spacing if no img is given, edge cases.
			result.push(<div key="img" className="img"></div>);
			result.push(<div key="arrow" className="arrow"></div>);
		}

		return <React.Fragment>{result}</React.Fragment>;
	};

	return (
		<div
			className="inline"
			onClick={() => {
				clicked();
			}}
		>
			{populate()}
		</div>
	);
};
