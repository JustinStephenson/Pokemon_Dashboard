import { act, render, screen } from '@testing-library/react';
import { getArtworkUrlById, preloadImage } from 'util/pictureRetrival';
import { Evolution, EvolutionChain } from './Evolution';

jest.mock('util/pictureRetrival', () => ({
	...jest.requireActual('util/pictureRetrival'),
	preloadImage: jest.fn(),
}));

const speciesUrl = (id: number) =>
	`https://pokeapi.co/api/v2/pokemon-species/${id}/`;

// Bulbasaur -> Ivysaur -> Venusaur
const chain: EvolutionChain = {
	baby_trigger_item: '',
	id: '1',
	chain: {
		evolution_details: [],
		is_baby: false,
		species: { name: 'bulbasaur', url: speciesUrl(1) },
		evolves_to: [
			{
				evolution_details: [],
				is_baby: false,
				species: { name: 'ivysaur', url: speciesUrl(2) },
				evolves_to: [
					{
						evolution_details: [],
						is_baby: false,
						species: { name: 'venusaur', url: speciesUrl(3) },
						evolves_to: [],
					},
				],
			},
		],
	},
};

describe('Evolution', () => {
	let finishLoading: () => void;

	beforeEach(() => {
		const loaded = new Promise<void>((resolve) => {
			finishLoading = resolve;
		});
		(preloadImage as jest.Mock).mockImplementation(() => loaded);
	});

	it('loads every evolution image at the same time', () => {
		const { container } = render(<Evolution evolutionDetails={chain} />);

		// all three requested before any has finished, spinner still showing
		expect(preloadImage).toHaveBeenCalledTimes(3);
		expect(preloadImage).toHaveBeenCalledWith(getArtworkUrlById(1));
		expect(preloadImage).toHaveBeenCalledWith(getArtworkUrlById(2));
		expect(preloadImage).toHaveBeenCalledWith(getArtworkUrlById(3));
		expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
	});

	it('shows the chain in order once the images are ready', async () => {
		const { container } = render(<Evolution evolutionDetails={chain} />);

		await act(async () => {
			finishLoading();
		});

		const images = screen.getAllByAltText('evolution');
		expect(images.map((img) => img.getAttribute('src'))).toEqual([
			getArtworkUrlById(1),
			getArtworkUrlById(2),
			getArtworkUrlById(3),
		]);
		// an arrow between each stage, none after the last
		expect(container.querySelectorAll('.evolution--arrow')).toHaveLength(2);
		expect(container.querySelector('.loading-spinner')).not.toBeInTheDocument();
	});
});
