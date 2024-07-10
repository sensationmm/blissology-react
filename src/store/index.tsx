import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import filtersReducer from './reducers/filters';
import guestsReducer from './reducers/guests';
import menuReducer from './reducers/menu';
import menuChoicesReducer from './reducers/menuChoices';
import suppliersReducer from './reducers/suppliers';
import uiReducer from './reducers/ui';
import weddingReducer from './reducers/wedding';

const store = configureStore({
  reducer: {
    auth: authReducer,
    dining: diningReducer,
    filters: filtersReducer,
    guests: guestsReducer,
    menu: menuReducer,
    menuChoices: menuChoicesReducer,
    suppliers: suppliersReducer,
    ui: uiReducer,
    wedding: weddingReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
