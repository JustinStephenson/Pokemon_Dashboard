import { PokeDropDown } from '../dropdown/PokeDropDown';
import './Header.scss';

export const Header = () => {
	return (
		<div className="header">
			<PokeDropDown />
		</div>
	);
};
