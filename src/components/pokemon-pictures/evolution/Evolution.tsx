import './Evolution.scss';

export type EvolutionChain = {
	baby_trigger_item: string;
	chain: {
		evolution_details: object[];
		evolves_to: object[];
		is_baby: boolean;
		species: {
			name: string;
			url: string;
		};
	};
	id: string;
};

export type EvolutionProps = {
	evolutionDetails: EvolutionChain | null;
};

export const Evolution = (props: EvolutionProps) => {
	return <div>Evolution</div>;
};
