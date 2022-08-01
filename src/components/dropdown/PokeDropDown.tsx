import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import { Pokemon } from '../../store/actions';
import { DropDown, DropDownProps } from './DropDown';
import { getAllPokemon, getPokemonAndNeighborInfo } from 'util/apiCall';
import { getIdFromUrl } from 'util/misc';

export const PokeDropDown = () => {
	// Global state
	const allPokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});

	// Component state
	const [dropDownProps, setDropDownProps] = useState<DropDownProps>({
		value: 'Select Pokemon',
		text: [],
		clickItemCallback: () => {},
	});
	const [dropDownPokemon, setDropDownPokemon] = useState<Pokemon[]>([]);
	const [key, setKey] = useState<number>(0);

	// initialize (call Api)
	useEffect(() => {
		getAllPokemon();
	}, []);

	// update dropdown values when we get list of all pokemon
	useEffect(() => {
		if (allPokemon) {
			setDropDownProps({
				text: fillTextWithPokemonName(allPokemon),
				clickItemCallback: (itemSelected: string) => {
					const pokeIndex = getIndexFromPokemonName(allPokemon, itemSelected);
					if (pokeIndex) {
						getPokemonAndNeighborInfo(pokeIndex);
					}
				},
				changeValueCallback: (value: string) => {
					setDropDownPokemon(searchPokemon(value.toLowerCase()));
				},
			});
		}
	}, [allPokemon]);

	useEffect(() => {
		setDropDownProps({
			...dropDownProps,
			text: fillTextWithPokemonName(dropDownPokemon),
		});
	}, [dropDownPokemon]);

	const searchPokemon = (value: string): Pokemon[] => {
		let searchResult: Pokemon[] = [];
		if (allPokemon) {
			for (let pokemon of allPokemon) {
				if (pokemon.name.startsWith(value)) {
					searchResult.push(pokemon);
				}
			}
		}
		return searchResult;
	};

	const getIndexFromPokemonName = (
		pokeList: Pokemon[],
		pokeName: string
	): number | null => {
		const pokemon = pokeList.find((pokemon) => pokemon.name === pokeName);
		if (pokemon) {
			return getIdFromUrl(pokemon.url);
		}
		return null;
	};

	const fillTextWithPokemonName = (pokeList: Pokemon[]): string[] => {
		return pokeList.map((poke) => {
			return poke.name;
		});
	};

	return (
		<React.Fragment>
			<DropDown {...dropDownProps} />
		</React.Fragment>
	);
};
