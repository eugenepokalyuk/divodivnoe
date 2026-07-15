import { configureStore } from '@reduxjs/toolkit';

import { shopApi } from './api/shopApi';

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
  },
  // RTK Query держит на middleware кэш, дедупликацию запросов и статусы
  // загрузки — без него хуки работать не будут.
  middleware: (getDefault) => getDefault().concat(shopApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
