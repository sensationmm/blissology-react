import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/auth';
import filtersReducer from './reducers/filters';
import guestsReducer from './reducers/guests';
import menuReducer from './reducers/menu';
import menuChoicesReducer from './reducers/menuChoices';
import ordersReducer from './reducers/orders';
import paymentsReducer from './reducers/payments';
import quoteConfigReducer from './reducers/quoteConfig';
import roomsReducer from './reducers/rooms';
import suppliersReducer from './reducers/suppliers';
import uiReducer from './reducers/ui';
import upgradeChoicesReducer from './reducers/upgradeChoices';
import upgradeReducer from './reducers/upgrades';
import weddingReducer from './reducers/wedding';

const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    guests: guestsReducer,
    menu: menuReducer,
    menuChoices: menuChoicesReducer,
    orders: ordersReducer,
    payments: paymentsReducer,
    quoteConfig: quoteConfigReducer,
    rooms: roomsReducer,
    suppliers: suppliersReducer,
    ui: uiReducer,
    upgradeChoices: upgradeChoicesReducer,
    upgrades: upgradeReducer,
    wedding: weddingReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
