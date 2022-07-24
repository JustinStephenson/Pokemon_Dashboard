import React, { useEffect, useState } from 'react';
import { Button } from 'components/button/Button';
import { Picture } from './Picture';
import { AdvancedDisplay } from './advanced-display/AdvancedDisplay';
import { Variates } from '../variates/Variates';
import { Evolution } from '../evolution/Evolution';
import './PokemonPic.scss';
import { useAppSelector } from 'util/hooks';

export const PokemonPic = () => {
	const pokemonDetails = useAppSelector((state) => {
		return state.pokemonDetails;
	});

	const [display, setDisplay] = useState<JSX.Element>();
	const [isEvoButton, setIsEvoButton] = useState<boolean>(false);
	const [isVarButton, setIsVarButton] = useState<boolean>(false);

	useEffect(() => {
		setDisplay(mainDisplay());
	}, []);

	useEffect(() => {
		if (pokemonDetails) {
			setIsEvoButton(true);
			setIsVarButton(true);
		}
	});

	const mainDisplay = (): JSX.Element => {
		return (
			<React.Fragment>
				<div className="container-button">{showVariatesButton()}</div>
				<Picture />
				<div className="container-button">{showEvolutionButton()}</div>
			</React.Fragment>
		);
	};

	const variatesDisplay = (): JSX.Element => {
		return (
			<AdvancedDisplay onGoBackClick={onGoBackClick}>
				<Variates />
			</AdvancedDisplay>
		);
	};

	const evolutionDisplay = (): JSX.Element => {
		return (
			<AdvancedDisplay onGoBackClick={onGoBackClick}>
				<Evolution />
			</AdvancedDisplay>
		);
	};

	const showVariatesButton = (): JSX.Element | null => {
		if (isVarButton) {
			return <Button text="Variates" onClick={onClickVariates} />;
		}
		return null;
	};

	const showEvolutionButton = (): JSX.Element | null => {
		if (isEvoButton) {
			return <Button text="Evolution" onClick={onClickEvolution} />;
		}
		return null;
	};

	const onGoBackClick = (): void => {
		setDisplay(mainDisplay());
	};

	const onClickVariates = (): void => {
		setDisplay(variatesDisplay());
	};

	const onClickEvolution = (): void => {
		setDisplay(evolutionDisplay());
	};

	return <div className="container">{display}</div>;
};
