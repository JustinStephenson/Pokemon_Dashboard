import { Inline, InlineProps } from './Inline';

const inlineProps: InlineProps = {
	isNextPokemon: false,
};

export const PrevPokemon = () => {
	return <Inline {...inlineProps} />;
};
