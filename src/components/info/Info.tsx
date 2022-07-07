import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import { getImgImportFromName, ImgImport } from 'img/types';
import { numToDec, mToFeet, kgToLbs } from 'shared/conversions';
import './Info.scss';

export type InfoProps = {};

export type PokemonTypes = {
	slot: number;
	type: { name: string; url: string };
};

export type PokemonAbilities = {
	ability: { name: string; url: string };
	is_hidden: boolean;
	slot: number;
};

export const Info = (props: InfoProps) => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	const [pokeName, setPokeName] = useState<string>('');
	const [pokeDex, setPokeDex] = useState<number>(0);
	const [pokeTypes, setPokeTypes] = useState<PokemonTypes[]>([]);
	const [pokeAbilities, setPokeAbilities] = useState<PokemonAbilities[]>([]);
	const [pokeHeight, setPokeHeight] = useState<number>(0);
	const [pokeWeight, setPokeWeight] = useState<number>(0);
	const [pokeIsBaby, setPokeIsBaby] = useState<boolean>(false);
	const [pokeIsLegendary, setPokeIsLegendary] = useState<boolean>(false);
	const [pokeIsMythical, setPokeIsMythical] = useState<boolean>(false);

	// set all state that uses pokemonDetails
	useEffect(() => {
		if (pokemonDetails) {
			console.log('details');
			setPokeName(pokemonDetails.name);
			setPokeDex(pokemonDetails.id);
			setPokeTypes(pokemonDetails.types);
			setPokeAbilities(pokemonDetails.abilities);
			setPokeHeight(pokemonDetails.height);
			setPokeWeight(pokemonDetails.weight);
		}
	}, [pokemonDetails]);

	// set all state that uses pokemonSpecies
	useEffect(() => {
		if (pokemonSpecies) {
			console.log('species');
			setPokeIsBaby(pokemonSpecies.is_baby);
			setPokeIsLegendary(pokemonSpecies.is_legendary);
			setPokeIsMythical(pokemonSpecies.is_mythical);
		}
	}, [pokemonSpecies]);

	const populateName = (): JSX.Element => {
		return <React.Fragment>{pokeName}</React.Fragment>;
	};

	const populateDex = (): JSX.Element => {
		return <React.Fragment># {pokeDex}</React.Fragment>;
	};

	const populateType = (): JSX.Element[] => {
		const imgImports: ImgImport[] = [];
		pokeTypes.forEach((type) => {
			imgImports.push(getImgImportFromName(type.type.name));
		});

		const renderTypesFromImports = (): JSX.Element[] => {
			const result: JSX.Element[] = [];
			for (let i = 0; i < imgImports.length; i++) {
				result.push(
					<React.Fragment key={i}>
						<img
							src={imgImports[i]}
							alt="Type Image"
							className="info__body-bot-types"
						></img>
					</React.Fragment>
				);
			}
			return result;
		};

		return renderTypesFromImports();
	};

	const populateAbilities = (): JSX.Element[] => {
		const result: JSX.Element[] = [];
		for (let i = 0; i < pokeAbilities.length; i++) {
			if (pokeAbilities[i].is_hidden) {
				result.push(
					<React.Fragment key={i}>
						<div className="info__body-bot-abilities">
							<p>{pokeAbilities[i].ability.name}</p>
							<p className="info__body-bot-abilities-hidden">Hidden Ability</p>
						</div>
					</React.Fragment>
				);
			} else {
				result.push(
					<React.Fragment key={i}>
						<p className="info__body-bot-abilities">
							{pokeAbilities[i].ability.name}
						</p>
					</React.Fragment>
				);
			}
		}
		return result;
	};

	// height comes in meters, last num is a decimal
	// convert height to proper meters and inches
	const populateHeight = (): JSX.Element => {
		const heightKg = numToDec(pokeHeight, 1);
		const heightFeet = mToFeet(+heightKg, 1);
		return (
			<React.Fragment>
				<div className="info__body-bot-hw">{heightKg} m</div>
				<div className="info__body-bot-hw">{heightFeet}</div>
			</React.Fragment>
		);
	};

	// weight comes in kg, last num is a decimal
	// convert weight to proper kg and lbs
	const populateWeight = (): JSX.Element => {
		const weightKg = numToDec(pokeWeight, 1);
		const weightLbs = kgToLbs(+weightKg, 1);
		return (
			<React.Fragment>
				<div className="info__body-bot-hw">{weightKg} kg</div>
				<div className="info__body-bot-hw">{weightLbs} lbs</div>
			</React.Fragment>
		);
	};

	return (
		<div className="info">
			<div className="info__header">
				<div className="info__header-text">Pokemon Information</div>
			</div>
			<div className="info__body">
				<div className="info__body-name">
					<div className="info__body-top">Name</div>
					<div className="info__body-bot">{populateName()}</div>
				</div>
				<div className="info__body-dex">
					<div className="info__body-top">Pokedex Entry</div>
					<div className="info__body-bot">{populateDex()}</div>
				</div>
				<div className="info__body-type">
					<div className="info__body-top">Type</div>
					<div className="info__body-bot">{populateType()}</div>
				</div>
				<div className="info__body-abilities">
					<div className="info__body-top">Abilities</div>
					<div className="info__body-bot">{populateAbilities()}</div>
				</div>
				<div className="info__body-height">
					<div className="info__body-top">Height</div>
					<div className="info__body-bot">{populateHeight()}</div>
				</div>
				<div className="info__body-weight">
					<div className="info__body-top">Weight</div>
					<div className="info__body-bot">{populateWeight()}</div>
				</div>
				<div className="info__body-identity">
					<div>
						<div className="info__body-top">Hello</div>
						<div className="info__body-bot">Name</div>
					</div>
					<div>
						<div className="info__body-top">Hello2</div>
						<div className="info__body-bot">Name2</div>
					</div>
					<div className="info__body-identity-last">
						<div className="info__body-top">Hello3</div>
						<div className="info__body-bot">Name3</div>
					</div>
				</div>
			</div>
		</div>
	);
};
