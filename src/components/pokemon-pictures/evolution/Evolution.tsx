import { useAppSelector } from 'util/hooks';
import './Evolution.scss';

export type EvolutionProps = {};

export const Evolution = (props: EvolutionProps) => {
	const pokemonSpecies: any = useAppSelector((state) => {
		return state.pokemonSpecies;
	});

	return <div className="evolution"></div>;
};
