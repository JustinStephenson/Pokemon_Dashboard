import { ActionTypes, Action } from '../actions';

export default (state: any = null, action: Action) => {
	switch (action.type) {
		case ActionTypes.FETCH_POKEMON_SPECIES:
			return action.payload;
		default:
			return state;
	}
};
