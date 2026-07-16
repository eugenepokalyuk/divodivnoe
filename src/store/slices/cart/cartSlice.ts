import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AddToCartPayload, CartLine, CartState } from './types';

const initialState: CartState = {
  lines: [],
  serverUuid: null,
  hydrated: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /** Загрузка сохранённой корзины из localStorage на старте. */
    hydrate(state, action: PayloadAction<Pick<CartState, 'lines' | 'serverUuid'>>) {
      state.lines = action.payload.lines;
      state.serverUuid = action.payload.serverUuid;
      state.hydrated = true;
    },

    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { quantity = 1, ...rest } = action.payload;
      const existing = state.lines.find((l) => l.productId === rest.productId);
      if (existing) {
        // 99 — тот же потолок, что валидирует бэкенд (CartItemWriteSerializer).
        existing.quantity = Math.min(existing.quantity + quantity, 99);
      } else {
        state.lines.push({ ...rest, quantity: Math.min(quantity, 99) });
      }
    },

    setQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const { productId, quantity } = action.payload;
      const line = state.lines.find((l) => l.productId === productId);
      if (!line) return;
      if (quantity <= 0) {
        state.lines = state.lines.filter((l) => l.productId !== productId);
      } else {
        line.quantity = Math.min(quantity, 99);
      }
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.lines = state.lines.filter((l) => l.productId !== action.payload);
    },

    clearCart(state) {
      state.lines = [];
    },

    /** Замена корзины содержимым, пришедшим с бэкенда (открыли по ссылке
     *  «поделиться»). Принимаем и uuid — дальше синхронизируемся уже с ним. */
    loadCart(
      state,
      action: PayloadAction<{ lines: CartLine[]; serverUuid: string }>,
    ) {
      state.lines = action.payload.lines;
      state.serverUuid = action.payload.serverUuid;
      state.hydrated = true;
    },

    /** Проставляется после первого создания корзины на бэкенде. */
    setServerUuid(state, action: PayloadAction<string>) {
      state.serverUuid = action.payload;
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const cartActions = cartSlice.actions;
export const {
  hydrate,
  addToCart,
  setQuantity,
  removeFromCart,
  clearCart,
  loadCart,
  setServerUuid,
} = cartSlice.actions;
