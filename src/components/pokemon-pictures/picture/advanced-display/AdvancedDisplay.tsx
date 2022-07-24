import React from 'react';
import { Button } from 'components/button/Button';
import './AdvancedDisplay.scss';

type AdvanceDisplayProps = {
	children: React.ReactNode;
	onGoBackClick: () => void;
};

export const AdvancedDisplay = (props: AdvanceDisplayProps) => {
	return (
		<div className="advanced-display">
			<div className="advanced-display-content">{props.children}</div>
			<Button text="Go Back" onClick={props.onGoBackClick} />
		</div>
	);
};
