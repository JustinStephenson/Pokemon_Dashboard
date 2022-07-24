import React, { useEffect, useState } from 'react';
import { Button } from 'components/button/Button';
import { Picture } from './Picture';
import { AdvancedDisplay } from './advanced-display/AdvancedDisplay';
import {
	Varieties,
	VarietiesProps,
	VarietiesType,
} from '../variates/Varieties';
import {
	Evolution,
	EvolutionChain,
	EvolutionProps,
} from '../evolution/Evolution';
import { useAppSelector } from 'util/hooks';
import { getApiResponseFromUrl } from 'util/apiCall';
import './PokemonPic.scss';

export const PokemonPic = () => {
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	const [display, setDisplay] = useState<JSX.Element>();
	const [isEvoButton, setIsEvoButton] = useState<boolean>(false);
	const [isVarButton, setIsVarButton] = useState<boolean>(false);
	const [evoProps, setEvoProps] = useState<EvolutionProps>({
		evolutionDetails: null,
	});
	const [varProps, setVarProps] = useState<VarietiesProps>({
		VarietyDetails: null,
	});

	useEffect(() => {
		if (pokemonSpecies) {
			// get Evolution chain
			const evoResponse = getApiResponseFromUrl(
				pokemonSpecies.evolution_chain.url
			);
			evoResponse.then((obj: EvolutionChain) => {
				if (obj.chain.evolves_to.length) {
					setIsEvoButton(true);
					setEvoProps({ ...evoProps, evolutionDetails: obj });
				} else {
					setIsEvoButton(false);
				}
			});

			// get Varieties
			const varieties: VarietiesType = pokemonSpecies.varieties;
			if (varieties.length > 1) {
				setIsVarButton(true);
				setVarProps({ ...varProps, VarietyDetails: varieties });
			}
		}
	}, [pokemonSpecies]);

	useEffect(() => {
		setDisplay(mainDisplay());
	}, [isEvoButton, isVarButton]);

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
				<Varieties VarietyDetails={varProps.VarietyDetails} />
			</AdvancedDisplay>
		);
	};

	const evolutionDisplay = (): JSX.Element => {
		return (
			<AdvancedDisplay onGoBackClick={onGoBackClick}>
				<Evolution evolutionDetails={evoProps.evolutionDetails} />
			</AdvancedDisplay>
		);
	};

	const showVariatesButton = (): JSX.Element | null => {
		if (isVarButton) {
			return <Button text="Variates" onClick={onClickVariates} />;
		}
		return <div className="button-space"></div>;
	};

	const showEvolutionButton = (): JSX.Element | null => {
		if (isEvoButton) {
			return <Button text="Evolution" onClick={onClickEvolution} />;
		}
		return <div className="button-space"></div>;
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
