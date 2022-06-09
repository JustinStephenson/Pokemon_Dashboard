import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../util/hooks';
import { Pokemon, pokemonActions } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { DropDown, DropDownProps } from './DropDown';

export const PokeDropDown = () => {
	// Config
	const dispatch = useAppDispatch();
	const { fetchAllPokemon } = bindActionCreators(pokemonActions, dispatch);
	const pokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});

	// Component State
	let [dropDownProps, setDropDownProps] = useState<DropDownProps>({
		text: [],
	});

	useEffect(() => {
		fetchAllPokemon();
	}, []);

	useEffect(() => {
		if (pokemon) {
			setDropDownProps({ text: fillTextWithPokemon(pokemon) });
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
