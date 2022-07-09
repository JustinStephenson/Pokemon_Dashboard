import './CheckBox.scss';

type CheckBoxProps = {
	isChecked: boolean;
};

//TODO: change look of true and false

export const CheckBox = (props: CheckBoxProps) => {
	return (
		<input className="checkbox" type="checkbox" checked={props.isChecked} />
	);
};
