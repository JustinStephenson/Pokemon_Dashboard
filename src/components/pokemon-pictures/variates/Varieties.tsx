import './Varieties.scss';

export type VarietiesType = [
	{
		is_default: boolean;
		pokemon: {
			name: string;
			url: string;
		};
	}
];

export type VarietiesProps = {
	VarietyDetails: VarietiesType | null;
};

export const Varieties = (props: VarietiesProps) => {
	return <div>Variates</div>;
};
