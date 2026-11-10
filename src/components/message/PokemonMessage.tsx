import { useEffect, useState } from 'react';
import { getPokeball } from 'util/apiCall';
import { useAppSelector } from 'util/hooks';
import { SPRITE_SIZE } from 'util/pictureRetrival';
import { Message } from './Message';
import './PokemonMessage.scss';

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
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	const [message, setMessage] = useState<string>('');
	const [pokeball, setPokeball] = useState<string>('');

	const getEnglishText = (): string | null => {
		const ENGLISH_TEXT: string = 'en';
		const result: FlavorTextEntry = pokemonSpecies.flavor_text_entries.find(
			(obj: FlavorTextEntry) => obj.language.name === ENGLISH_TEXT
		);
		return result.flavor_text;
	};

	useEffect(() => {
		setPokeBallImg();
	}, []);

	const sprite: string = pokemonDetails
		? pokemonDetails.sprites['front_default'] ?? ''
		: '';

	useEffect(() => {
		if (pokemonSpecies) {
			const message: string | null = getEnglishText();
			if (message) {
				setMessage(message);
			} else {
				setMessage('No English Message Available');
			}
		}
	}, [pokemonSpecies]);

	const setPokeBallImg = (): void => {
		const response = getPokeball();
		response.then((obj: any) => {
			setPokeball(obj.sprites.default);
		});
	};

	const spriteSize = { width: SPRITE_SIZE, height: SPRITE_SIZE };

	return (
		<div className="pokemon-message">
			<img
				className="pokemon-message-top-right"
				alt="sprite"
				src={sprite}
				{...spriteSize}
			/>
			<img
				className="pokemon-message-top-left"
				alt="sprite"
				src={sprite}
				{...spriteSize}
			/>
			<Message message={message} />
			<img
				className="pokemon-message-bot-right"
				alt="sprite"
				src={pokeball}
				{...spriteSize}
			/>
			<img
				className="pokemon-message-bot-left"
				alt="sprite"
				src={pokeball}
				{...spriteSize}
			/>
		</div>
	);
};
