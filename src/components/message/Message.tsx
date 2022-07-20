import './Message.scss';

type MessageProps = {
	message: string;
};

export const Message = (props: MessageProps) => {
	// remove all \{val} from text
	const cleanText = (text: string): string => {
		return text.replace(/[\f]/g, ' ');
	};

	return (
		<div className="message">
			{/* <p className="message-title">Description</p> */}
			<p className="message-text">{cleanText(props.message)}</p>
		</div>
	);
};
