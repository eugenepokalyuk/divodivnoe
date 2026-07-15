import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { catalogApi } from './api/catalogApi';
import { promotionsReducer } from './slices/promotions';

const rootReducer = combineReducers({
  promotions: promotionsReducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  // RTK Query держит на middleware кэш, дедупликацию запросов и статусы
  // загрузки — без него хуки работать не будут.
  middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
