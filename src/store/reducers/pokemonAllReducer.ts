import { Pokemon, ActionTypes, Action } from '../actions';

export default (state: Pokemon[] = [], action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_ALL_POKEMON:
			return action.payload;
		default:
			return state;
	}
};
