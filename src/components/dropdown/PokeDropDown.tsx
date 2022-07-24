import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import { Pokemon } from '../../store/actions';
import { DropDown, DropDownProps } from './DropDown';
import { getAllPokemon, getPokemonAndNeighborInfo } from 'util/apiCall';

export const PokeDropDown = () => {
	// Global state
	const allPokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});

	// Component state
	let [dropDownProps, setDropDownProps] = useState<DropDownProps>({
		value: 'Select Pokemon',
		text: [],
		callback: () => {},
	});

	// initialize (call Api)
	useEffect(() => {
		getAllPokemon();
	}, []);

	// update dropdown values when we get list of all pokemon
	useEffect(() => {
		if (allPokemon) {
			setDropDownProps({
				text: fillTextWithPokemonName(allPokemon),
				callback: (index: number) => {
					// index, is the pos in the array of given pokemon
					// this corresponds to the id + 1 of the pokemon
					const pokeIndex = index + 1;
					getPokemonAndNeighborInfo(pokeIndex);
				},
			});
		}
	}, [allPokemon]);

	// update dropdown value when pokemon is selected by other means
	useEffect(() => {
		if (pokemonDetails) {
			setDropDownProps({ ...dropDownProps, value: pokemonDetails.name });
		}
	}, [pokemonDetails]);

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
