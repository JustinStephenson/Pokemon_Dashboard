import React, { useEffect } from 'react';
import { Header } from './header/Header';
import { Info } from './info/Info';
import { PrevPokemon } from './pokemon-pictures/prev-next-pokemon/PrevPokemon';
import { NextPokemon } from './pokemon-pictures/prev-next-pokemon/NextPokemon';
import { Statistics } from './statistics/Statistics';
import { PokemonMessage } from './message/PokemonMessage';
import { PokemonPic } from './pokemon-pictures/picture/PokemonPic';
import { DashboardOverlay } from './overlay/DashboardOverlay';
import './App.scss';

export const App = (): JSX.Element => {
	return (
		<React.Fragment>
			<div className="dashboard">
				<Header />
				<div className="dashboard__section-1 u-margin-sides-medium">
					<PrevPokemon />
					<PokemonPic />
					<NextPokemon />
				</div>
				<div className="dashboard__section-2 u-margin-sides-medium">
					<Info />
					<div className="split-section-2">
						<Statistics />
						<PokemonMessage />
					</div>
				</div>
			</div>
			<DashboardOverlay />
		</React.Fragment>
	);
};
