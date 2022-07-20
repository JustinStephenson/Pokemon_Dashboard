import { useState, useEffect, useRef } from 'react';
import './DropDown.scss';

export type DropDownProps = {
	value?: string;
	text: string[];
	callback?: (...args: any[]) => void;
};

export const DropDown = (props: DropDownProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<string>('Select');
	const elementRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// set text value
	useEffect(() => {
		if (props.value) {
			setSelected(props.value);
		}
	});

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

	const dropDownClick = (text: string) => {
		if (!props.value) {
			setSelected(text);
		}
		if (dropdownRef.current) {
			dropdownRef.current.scrollTo(0, 0);
		}
	};

	const renderContent = (): JSX.Element[] => {
		let result: JSX.Element[] = [];
		for (let i = 0; i < props.text.length; i++) {
			result.push(
				<div
					key={i}
					onClick={() => {
						dropDownClick(props.text[i]);
						if (props.callback) {
							props.callback(i);
						}
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
		<div ref={elementRef} className="dropdown u-margin-sides-big">
			<button onClick={setIsOpenClick} className="dropdown__btn">
				{selected}
			</button>
			<div
				ref={dropdownRef}
				className={`dropdown__container ${isOpen ? 'visible' : ''}`}
			>
				<div onClick={setIsOpenClick} className={`dropdown__content`}>
					{renderContent()}
				</div>
			</div>
		</div>
	);
};
