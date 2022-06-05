import { ActionTypes, Action } from '../actions';

export default (state: number = 1, action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_POKEMON_COUNT:
			return action.payload;
		default:
			return state;
	}
};
