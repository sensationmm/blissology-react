import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import guestsReducer from './reducers/guests';
import weddingReducer from './reducers/wedding';

const store = configureStore({
  reducer: {
    auth: authReducer,
    wedding: weddingReducer,
    guests: guestsReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
