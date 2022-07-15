import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import { Pokemon } from '../../store/actions';
import { DropDown, DropDownProps } from './DropDown';
import { getAllPokemon, getPokemonDetailsById } from 'util/apiCall';

export const PokeDropDown = () => {
	// Global state
	const allPokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});

	// Component state
	let [dropDownProps, setDropDownProps] = useState<DropDownProps>({
		initial: 'Select Pokemon',
		text: [],
		callback: () => {},
	});

	useEffect(() => {
		getAllPokemon();
	}, []);

	useEffect(() => {
		if (allPokemon) {
			setDropDownProps({
				text: fillTextWithPokemon(allPokemon),
				callback: (index: number) => {
					// index, is the pos in the array of given pokemon
					// this corresponds to the id + 1 of the pokemon
					const pokeIndex = index + 1;
					getPokemonDetailsById(pokeIndex);
				},
			});
		}
	}, [allPokemon]);

	const fillTextWithPokemon = (pokeList: Pokemon[]): string[] => {
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
