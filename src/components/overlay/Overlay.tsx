import './Overlay.scss';

type OverlayProps = {
	show: boolean;
	style?: React.CSSProperties;
};

export const Overlay = (props: OverlayProps) => {
	return props.show ? (
		<div className="overlay" style={props.style}></div>
	) : null;
};
