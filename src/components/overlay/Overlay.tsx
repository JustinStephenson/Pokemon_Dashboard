import './Overlay.scss';

type OverlayProps = {
	show: boolean;
};

export const Overlay = (props: OverlayProps) => {
	return props.show ? <div className="overlay"></div> : null;
};
