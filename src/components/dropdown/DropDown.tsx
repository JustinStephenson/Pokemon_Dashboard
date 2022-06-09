import React, { useState, useEffect, useRef } from 'react';
import './DropDown.scss';

// TODO: force same array size
export type DropDownProps = {
	text: string[];
	icon?: string[];
};

export const DropDown = (props: DropDownProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [dropDownText, setDropDownText] = useState('Select');
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onBodyClick = (event: MouseEvent) => {
			if (event.target instanceof Element) {
				if (elementRef.current && elementRef.current.contains(event.target)) {
					return;
				}
				setIsOpen(false);
			}
		};

		// Bind the event listener
		document.addEventListener('mousedown', onBodyClick, { capture: true });

		// Unbind the event listener on clean up
		return () => {
			document.removeEventListener('mousedown', onBodyClick, {
				capture: true,
			});
		};
	}, []);

	const setIsOpenClick = () => {
		setIsOpen(!isOpen);
	};

	const setDropDownTextClick = (text: string) => {
		setDropDownText(text);
	};

	const renderContent = (): JSX.Element[] => {
		let result: JSX.Element[] = [];
		for (let i = 0; i < props.text.length; i++) {
			result.push(
				<div
					key={i}
					onClick={() => {
						setDropDownTextClick(props.text[i]);
						setIsOpenClick();
					}}
					className="dropdown__item"
				>
					{props.text[i]}
				</div>
			);
		}
		return result;
	};

	return (
		<div ref={elementRef} className="dropdown u-margin-sides">
			<button onClick={setIsOpenClick} className="dropdown__btn">
				{dropDownText}
			</button>
			<div className={`dropdown__container ${isOpen ? 'visible' : ''}`}>
				<div className={`dropdown__content`}>{renderContent()}</div>
			</div>
		</div>
	);
};
