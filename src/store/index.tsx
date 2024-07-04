import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import guestsReducer from './reducers/guests';
import suppliersReducer from './reducers/suppliers';
import uiReducer from './reducers/ui';
import weddingReducer from './reducers/wedding';

const store = configureStore({
  reducer: {
    auth: authReducer,
    guests: guestsReducer,
    suppliers: suppliersReducer,
    ui: uiReducer,
    wedding: weddingReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
