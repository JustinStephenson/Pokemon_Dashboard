import './App.scss';
import { Header } from './header/Header';
import { Picture } from './picture/Picture';
import { Statistics } from './statistics/Statistics';

export const App = (): JSX.Element => {
	return (
		<div className="dashboard">
			<Header />
			<div className="dashboard__section-1">
				<Picture />
				<Statistics />
			</div>
		</div>
	);
};
