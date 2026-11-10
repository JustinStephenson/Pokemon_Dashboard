import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import reducers from 'store/reducers';
import { ActionTypes } from 'store/actions';
import { getArtworkUrlById } from 'util/pictureRetrival';
import { makePokemon } from 'util/testFixtures';
import { Picture } from './Picture';

const renderPicture = (pokemonDetails: any) => {
	const store = configureStore({ reducer: reducers });
	store.dispatch({
		type: ActionTypes.FETCH_POKEMON_DETAILS,
		payload: pokemonDetails,
	});
	render(
		<Provider store={store}>
			<Picture />
		</Provider>
	);
	return store;
};

describe('Picture', () => {
	it('shows nothing before a Pokemon is selected', () => {
		renderPicture(null);
		expect(screen.queryByAltText('PokemonImg')).not.toBeInTheDocument();
	});

	it('uses the artwork url directly with its intrinsic size', () => {
		renderPicture(makePokemon(25));
		const img = screen.getByAltText('PokemonImg');

		expect(img).toHaveAttribute('src', getArtworkUrlById(25));
		expect(img).toHaveAttribute('width', '475');
		expect(img).toHaveAttribute('height', '475');
		expect(img).toHaveAttribute('decoding', 'async');
		expect(img).toHaveAttribute('fetchpriority', 'high');
	});

	it('fades the image in once it has loaded', () => {
		renderPicture(makePokemon(25));
		const img = screen.getByAltText('PokemonImg');

		expect(img).not.toHaveClass('picture__img--loaded');
		fireEvent.load(img);
		expect(img).toHaveClass('picture__img--loaded');
	});

	it('restarts the fade when the Main Pokemon changes', () => {
		const store = renderPicture(makePokemon(25));
		fireEvent.load(screen.getByAltText('PokemonImg'));

		act(() => {
			store.dispatch({
				type: ActionTypes.FETCH_POKEMON_DETAILS,
				payload: makePokemon(26),
			});
		});

		const img = screen.getByAltText('PokemonImg');
		expect(img).toHaveAttribute('src', getArtworkUrlById(26));
		expect(img).not.toHaveClass('picture__img--loaded');
	});
});
