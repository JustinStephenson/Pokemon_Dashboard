import { useEffect, useState } from 'react';
import { useAppSelector } from 'util/hooks';
import { Overlay } from './Overlay';

export const DashboardOverlay = () => {
	const pokemonDetails: any = useAppSelector((state) => {
		return state.pokemonDetails;
	});
	const [showOverlay, setShowOverlay] = useState<boolean>(true);

	useEffect(() => {
		if (pokemonDetails) {
			setShowOverlay(false);
		}
	}, [pokemonDetails]);

	const customStyle: React.CSSProperties = {
		height: '60vh',
	};

	return <Overlay show={showOverlay} style={customStyle} />;
};
