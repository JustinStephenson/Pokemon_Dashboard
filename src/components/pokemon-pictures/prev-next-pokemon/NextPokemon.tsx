import { Inline, InlineProps } from './Inline';

const inlineProps: InlineProps = {
	isNextPokemon: true,
};

export const NextPokemon = () => {
	return <Inline {...inlineProps} />;
};
