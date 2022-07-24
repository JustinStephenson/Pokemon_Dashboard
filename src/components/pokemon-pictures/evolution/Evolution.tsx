import { useAppSelector } from 'util/hooks';
import './Evolution.scss';

export const Evolution = () => {
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	return <div className="evolution"></div>;
};
