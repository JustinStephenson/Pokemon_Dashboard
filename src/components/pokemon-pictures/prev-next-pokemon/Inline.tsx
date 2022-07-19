import React from 'react';
import './Inline.scss';

export type InlineProps = {
	imgLocation: string;
	altString: string;
	isNextPokemon: boolean; // if next pokemon or previous pokemon
};

export const Inline = (props: InlineProps) => {
	const image = (): JSX.Element => {
		return <img key="image" src={props.imgLocation} alt={props.altString} />;
	};

	const arrow = (): JSX.Element => {
		return <img key="arrow" alt="arrow" />;
	};

	const flippedArrow = (): JSX.Element => {
		return <img key="arrow" alt="arrow" />;
	};

	const populate = (): JSX.Element => {
		let result: JSX.Element[] = [];
		if (props.isNextPokemon) {
			result.push(image());
			result.push(arrow());
		} else {
			result.push(flippedArrow());
			result.push(image());
		}
		return <React.Fragment>{result}</React.Fragment>;
	};

	return <div className="inline">{populate()}</div>;
};
