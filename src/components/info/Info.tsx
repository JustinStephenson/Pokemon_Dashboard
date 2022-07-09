import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import { getImgImportFromName, ImgImport } from 'img/types';
import { numToDec, mToFeet, kgToLbs } from 'shared/conversions';
import { CheckBox } from 'components/checkbox/CheckBox';
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

	// Component State
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
				<p className="info__body-bot-hw">{heightKg} m</p>
				<p className="info__body-bot-hw">{heightFeet}</p>
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
				<p className="info__body-bot-hw">{weightKg} kg</p>
				<p className="info__body-bot-hw">{weightLbs} lbs</p>
			</React.Fragment>
		);
	};

	return (
		<div className="info">
			<div className="info__header">
				<p className="info__header-text">Pokemon Information</p>
			</div>
			<div className="info__body">
				<div className="info__body-name">
					<p className="info__body-top">Name</p>
					<div className="info__body-bot">{populateName()}</div>
				</div>
				<div className="info__body-dex">
					<p className="info__body-top">Pokedex Entry</p>
					<div className="info__body-bot">{populateDex()}</div>
				</div>
				<div className="info__body-type">
					<p className="info__body-top">Type</p>
					<div className="info__body-bot">{populateType()}</div>
				</div>
				<div className="info__body-abilities">
					<p className="info__body-top">Abilities</p>
					<div className="info__body-bot">{populateAbilities()}</div>
				</div>
				<div className="info__body-height">
					<p className="info__body-top">Height</p>
					<div className="info__body-bot">{populateHeight()}</div>
				</div>
				<div className="info__body-weight">
					<p className="info__body-top">Weight</p>
					<div className="info__body-bot">{populateWeight()}</div>
				</div>
				<div className="info__body-identity">
					<div>
						<p className="info__body-top">Baby</p>
						<div className="info__body-bot info__body-bot-checkbox">
							<CheckBox isChecked={pokeIsBaby} />
						</div>
					</div>
					<div>
						<p className="info__body-top">Legendary</p>
						<div className="info__body-bot info__body-bot-checkbox">
							<CheckBox isChecked={pokeIsLegendary} />
						</div>
					</div>
					<div className="info__body-identity-last">
						<p className="info__body-top">Mythical</p>
						<div className="info__body-bot info__body-bot-checkbox">
							<CheckBox isChecked={pokeIsMythical} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
