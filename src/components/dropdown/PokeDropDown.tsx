import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../util/hooks';
import { Pokemon, pokemonActions } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { DropDown, DropDownProps } from './DropDown';

export const PokeDropDown = () => {
	// set-up dispatch
	const dispatch = useAppDispatch();
	const { fetchAllPokemon, fetchPokemonDetails, fetchPokemonSpecies } =
		bindActionCreators(pokemonActions, dispatch);

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
		fetchAllPokemon();
	}, []);

	useEffect(() => {
		if (allPokemon) {
			setDropDownProps({
				text: fillTextWithPokemon(allPokemon),
				callback: (index: number) => {
					// index, is the pos in the array of given pokemon
					// this corresponds to the id + 1 of the pokemon
					const pokeIndex = index + 1;
					fetchPokemonDetails(pokeIndex);
					fetchPokemonSpecies(pokeIndex);
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
