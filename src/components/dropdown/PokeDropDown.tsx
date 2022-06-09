import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../util/hooks';
import { Pokemon, pokemonActions } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { DropDown, DropDownProps } from './DropDown';

export const PokeDropDown = () => {
	// set-up dispatch
	const dispatch = useAppDispatch();
	const { fetchAllPokemon, fetchPokemonDetails } = bindActionCreators(
		pokemonActions,
		dispatch
	);

	// Global state
	const pokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});

	// Component state
	let [dropDownProps, setDropDownProps] = useState<DropDownProps>({
		text: [],
		callback: () => {},
	});

	useEffect(() => {
		fetchAllPokemon();
	}, []);

	useEffect(() => {
		if (pokemon) {
			setDropDownProps({
				text: fillTextWithPokemon(pokemon),
				callback: (index: number) => {
					// index, is the pos in the array of given pokemon
					// this corresponds to the id + 1 of the pokemon
					fetchPokemonDetails(index + 1);
				},
			});
		}
	}, [pokemon]);

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
