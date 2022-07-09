import './App.scss';
import { Header } from './header/Header';
import { Info } from './info/Info';
import { Picture } from './pokemon-pictures/picture/Picture';
import { Evolution } from './pokemon-pictures/evolution/Evolution';
import { PrevPokemon } from './pokemon-pictures/prev-next-pokemon/PrevPokemon';
import { NextPokemon } from './pokemon-pictures/prev-next-pokemon/NextPokemon';
import { Statistics } from './statistics/Statistics';

export const App = (): JSX.Element => {
	return (
		<div className="dashboard">
			<Header />
			<div className="dashboard__section-1 u-margin-sides-medium">
				<PrevPokemon />
				<Picture />
				<Evolution />
				<NextPokemon />
			</div>
			<div className="dashboard__section-2 u-margin-sides-medium">
				<Info />
				<div className="split-section-2">
					<Statistics />
				</div>
			</div>
		</div>
	);
};
