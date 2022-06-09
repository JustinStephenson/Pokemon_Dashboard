import './App.scss';
import { Header } from './header/Header';
import { Picture } from './picture/Picture';

export const App = (): JSX.Element => {
	return (
		<div className="dashboard">
			<Header />
			<Picture />
		</div>
	);
};
