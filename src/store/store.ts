import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducers from './reducers';

export const store = configureStore({
	reducer: reducers,
	middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
