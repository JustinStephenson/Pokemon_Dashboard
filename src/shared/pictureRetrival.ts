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
