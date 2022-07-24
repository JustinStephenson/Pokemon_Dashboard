import './Button.scss';

type ButtonProps = {
	text: string;
	onClick?: () => void;
};

export const Button = (props: ButtonProps) => {
	return (
		<button className="button" onClick={props.onClick}>
			{props.text}
		</button>
	);
};
