import { PokeDropDown } from '../dropdown/PokeDropDown';
import pokemonLogo from 'img/pokemon-logo/pokemon-logo-text.png';
import './Header.scss';

export const Header = () => {
	return (
		<div className="header">
			<div className="header-container">
				<img className="header-logo" src={pokemonLogo} alt="Pokemon Logo" />
			</div>
			<PokeDropDown />
		</div>
	);
};
