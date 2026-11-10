import { act, render, screen } from '@testing-library/react';
import { getApiResponseFromUrl } from 'util/apiCall';
import { getArtworkUrlById, preloadImage } from 'util/pictureRetrival';
import { makePokemon } from 'util/testFixtures';
import { Varieties, VarietiesType } from './Varieties';

jest.mock('util/apiCall', () => ({
	getApiResponseFromUrl: jest.fn(),
}));

jest.mock('util/pictureRetrival', () => ({
	...jest.requireActual('util/pictureRetrival'),
	preloadImage: jest.fn(),
}));

const pokemonUrl = (id: number) => `https://pokeapi.co/api/v2/pokemon/${id}/`;

const varieties = [
	{ is_default: true, pokemon: { name: 'venusaur', url: pokemonUrl(3) } },
	{ is_default: false, pokemon: { name: 'venusaur-mega', url: pokemonUrl(10033) } },
	{ is_default: false, pokemon: { name: 'venusaur-gmax', url: pokemonUrl(10195) } },
] as unknown as VarietiesType;

describe('Varieties', () => {
	let respond: () => void;

	beforeEach(() => {
		const responded = new Promise<void>((resolve) => {
			respond = resolve;
		});
		(getApiResponseFromUrl as jest.Mock).mockImplementation((url: string) =>
			responded.then(() => makePokemon(Number(url.split('/')[6])))
		);
		(preloadImage as jest.Mock).mockImplementation(() => Promise.resolve());
	});

	it('requests every variety at the same time, skipping the default', () => {
		render(<Varieties varietyDetails={varieties} />);

		expect(getApiResponseFromUrl).toHaveBeenCalledTimes(2);
		expect(getApiResponseFromUrl).toHaveBeenCalledWith(pokemonUrl(10033));
		expect(getApiResponseFromUrl).toHaveBeenCalledWith(pokemonUrl(10195));
	});

	it('shows each variety with its artwork and name', async () => {
		render(<Varieties varietyDetails={varieties} />);

		await act(async () => {
			respond();
		});

		const images = screen.getAllByAltText('variety');
		expect(images.map((img) => img.getAttribute('src'))).toEqual([
			getArtworkUrlById(10033),
			getArtworkUrlById(10195),
		]);
		expect(screen.getByText('venusaur-mega')).toBeInTheDocument();
		expect(screen.getByText('venusaur-gmax')).toBeInTheDocument();
	});
});
