import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../util/hooks';
import './Statistics.scss';

export type StatisticsProps = {};

type PokeStats = {
	base_stat: number;
	effort: number;
	stat: {
		name: string;
		url: string;
	};
};

export const Statistics = (props: StatisticsProps) => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const [pokeStats, setPokeStats] = useState<PokeStats[]>([]);

	useEffect(() => {
		if (pokemonDetails) {
			setPokeStats(pokemonDetails.stats);
		}
	}, [pokemonDetails]);

	const graph = (): JSX.Element[] => {
		const result: JSX.Element[] = [];
		for (let i = 0; i < pokeStats.length; i++) {
			result.push(
				<div
					key={i}
					style={{ gridColumn: `1 / ${pokeStats[i].base_stat}` }}
					className={`stats__graph-${i}`}
				></div>
			);
		}
		return result;
	};

	return (
		<div className="stats">
			<div className="stats__header">Base-Stats</div>
			<div className="stats__name">
				<p>Hp</p>
				<p>Attack</p>
				<p>Defense</p>
				<p>Sp. Attack</p>
				<p>Sp. Defense</p>
				<p>Speed</p>
			</div>
			<div className="stats__graph">{graph()}</div>
		</div>
	);
};
