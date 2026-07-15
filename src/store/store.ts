import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { promotionsReducer } from './slices/promotions';

const rootReducer = combineReducers({
  promotions: promotionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
