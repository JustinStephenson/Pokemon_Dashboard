import { ActionTypes, Action } from '../actions';

export default (state: any = null, action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_PREV_POKEMON_DETAILS:
			return action.payload;
		default:
			return state;
	}
};
