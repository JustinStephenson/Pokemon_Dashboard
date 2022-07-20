import { useEffect, useState } from 'react';
import { useAppSelector } from 'util/hooks';
import { Message } from './Message';

export const PokemonMessage = () => {
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	const [message, setMessage] = useState<string>('');

	useEffect(() => {
		if (pokemonSpecies) {
			setMessage(pokemonSpecies.flavor_text_entries[0].flavor_text);
		}
	}, [pokemonSpecies]);

	return <Message message={message} />;
};
