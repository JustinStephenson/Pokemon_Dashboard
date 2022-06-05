import './App.scss';
import { Header } from './header/Header';

export const App = (): JSX.Element => {
	return (
		<div className="dashboard">
			<Header />
		</div>
	);
};
