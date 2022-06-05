import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../util/hooks';
import { pokemonActions, Pokemon } from '../../store/actions';
import { bindActionCreators } from 'redux';
import { DropDown, DropDownProps } from './DropDown';

export const PokeDropDown = () => {
	const dispatch = useAppDispatch();
	const { fetchAllPokemon } = bindActionCreators(pokemonActions, dispatch);
	const pokemon: Pokemon[] = useAppSelector((state) => {
		return state.pokemonAll;
	});

	useEffect(() => {
		//fetchAllPokemon();
	}, []);

	const dropDownProps: DropDownProps = {
		text: [
			'test',
			'test2',
			'test3',
			'test',
			'test2',
			'test3',
			'test',
			'test2',
			'test3',
			'test',
			'test2',
			'test3',
		],
	};

	return (
		<React.Fragment>
			<DropDown {...dropDownProps} />
		</React.Fragment>
	);
};
