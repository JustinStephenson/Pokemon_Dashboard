//TODO: improve this to be more generic
export const getIdFromUrl = (url: string): number => {
	return parseInt(url.split('/')[6]);
};
