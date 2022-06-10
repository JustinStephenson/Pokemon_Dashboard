import './App.scss';
import { Header } from './header/Header';
import { Info } from './info/Info';
import { Picture } from './picture/Picture';
import { Statistics } from './statistics/Statistics';

export const App = (): JSX.Element => {
	return (
		<div className="dashboard">
			<Header />
			<div className="dashboard__section-1 u-margin-sides-medium">
				<Picture />
				<Statistics />
			</div>
			<div className="dashboard__section-2 u-margin-sides-medium">
				<Info />.
			</div>
		</div>
	);
};
