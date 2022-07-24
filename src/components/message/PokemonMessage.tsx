import { useEffect, useState } from 'react';
import { useAppSelector } from 'util/hooks';
import { Message } from './Message';

type FlavorTextEntry = {
	flavor_text: string;
	language: {
		name: string;
		url: string;
	};
	version: {
		name: string;
		url: string;
	};
};

export const PokemonMessage = () => {
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	const [message, setMessage] = useState<string>('');

	const getEnglishText = (): string | null => {
		const ENGLISH_TEXT: string = 'en';
		const result: FlavorTextEntry = pokemonSpecies.flavor_text_entries.find(
			(obj: FlavorTextEntry) => obj.language.name === ENGLISH_TEXT
		);
		return result.flavor_text;
	};

	useEffect(() => {
		if (pokemonSpecies) {
			const message = getEnglishText();
			if (message) {
				setMessage(message);
			} else {
				setMessage('No English Message Available');
			}
		}
	}, [pokemonSpecies]);

	return <Message message={message} />;
};
