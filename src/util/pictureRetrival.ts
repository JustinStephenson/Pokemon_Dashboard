import { pokeApi } from 'api/pokeApi';

export const getPicture = (loc: string): Promise<string> => {
	const apiRequest = async () => {
		const response = await pokeApi().get(loc, {
			responseType: 'arraybuffer',
		});
		return URL.createObjectURL(new Blob([response.data]));
	};
	return apiRequest();
};

export const getPictureById = (id: number): Promise<string> => {
	const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
	const apiRequest = async () => {
		const response = await pokeApi().get(url, {
			responseType: 'arraybuffer',
		});
		return URL.createObjectURL(new Blob([response.data]));
	};
	return apiRequest();
};
