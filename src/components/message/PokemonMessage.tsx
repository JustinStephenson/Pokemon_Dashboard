import { useEffect, useState } from 'react';
import { getPokeball } from 'util/apiCall';
import { useAppSelector } from 'util/hooks';
import { getPicture } from 'util/pictureRetrival';
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
	const [sprite, setSprite] = useState<string>('');
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

	useEffect(() => {
		if (pokemonDetails) {
			const loc: string = pokemonDetails.sprites['front_default'];
			getPicture(loc).then((imgUrl) => {
				setSprite(imgUrl);
			});
		}
	}, [pokemonDetails]);

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
			const loc: string = obj.sprites.default;
			getPicture(loc).then((imgUrl) => {
				setPokeball(imgUrl);
			});
		});
	};

	return (
		<div className="pokemon-message">
			<img className="pokemon-message-top-right" alt="sprite" src={sprite} />
			<img className="pokemon-message-top-left" alt="sprite" src={sprite} />
			<Message message={message} />
			<img className="pokemon-message-bot-right" alt="sprite" src={pokeball} />
			<img className="pokemon-message-bot-left" alt="sprite" src={pokeball} />
		</div>
	);
};
