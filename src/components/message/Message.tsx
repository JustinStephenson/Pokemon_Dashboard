import React from 'react';
import './Message.scss';

type MessageProps = {
	message: string;
	children?: React.ReactNode;
};

export const Message = (props: MessageProps) => {
	// remove all \{val} from text
	const cleanText = (text: string): string => {
		return text.replace(/[\f]/g, ' ');
	};

	return (
		<React.Fragment>
			{/* <p className="message-title">Description</p> */}
			<p className="message">{cleanText(props.message)}</p>
		</React.Fragment>
	);
};
