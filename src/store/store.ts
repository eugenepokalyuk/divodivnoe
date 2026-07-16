import { configureStore } from '@reduxjs/toolkit';

import { shopApi } from './api/shopApi';
import { cartReducer } from './slices/cart/cartSlice';
import { cartListener } from './slices/cart/cartSync';

export const store = configureStore({
  reducer: {
    [shopApi.reducerPath]: shopApi.reducer,
    cart: cartReducer,
  },
  // RTK Query держит на middleware кэш, дедупликацию запросов и статусы
  // загрузки — без него хуки работать не будут. cartListener синхронизирует
  // корзину с localStorage и бэкендом; prepend — чтобы он видел экшены
  // раньше остальной обработки.
  middleware: (getDefault) =>
    getDefault().prepend(cartListener.middleware).concat(shopApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
