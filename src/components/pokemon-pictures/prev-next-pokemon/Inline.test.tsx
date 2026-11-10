import { fireEvent, render, screen } from '@testing-library/react';
import { getPokemonAndNeighborInfo } from 'util/apiCall';
import { getArtworkUrlById } from 'util/pictureRetrival';
import { Inline } from './Inline';

jest.mock('util/apiCall', () => ({
	getPokemonAndNeighborInfo: jest.fn(),
}));

const renderInline = (imgLocation: string, pokemonId: number) => {
	const { container } = render(
		<Inline
			imgLocation={imgLocation}
			altString="pokeImg"
			isNextPokemon={true}
			pokemonId={pokemonId}
		/>
	);
	return container.querySelector('.inline') as HTMLElement;
};

describe('Inline (Neighbour button)', () => {
	it('shows the Neighbour artwork with its intrinsic size', () => {
		renderInline(getArtworkUrlById(26), 26);
		const img = screen.getByAltText('pokeImg');

		expect(img).toHaveAttribute('src', getArtworkUrlById(26));
		expect(img).toHaveAttribute('width', '475');
		expect(img).toHaveAttribute('height', '475');
	});

	it('shows that Neighbour as the Main Pokemon when clicked', () => {
		fireEvent.click(renderInline(getArtworkUrlById(26), 26));
		expect(getPokemonAndNeighborInfo).toHaveBeenCalledWith(26);
	});

	it('keeps its space but does nothing when there is no Neighbour', () => {
		const inline = renderInline('', 0);

		expect(screen.queryByAltText('pokeImg')).not.toBeInTheDocument();
		expect(inline.querySelector('.img')).toBeInTheDocument();
		fireEvent.click(inline);
		expect(getPokemonAndNeighborInfo).not.toHaveBeenCalled();
	});
});
