import type { RootState } from '@/store/store';

export const selectCartLines = (state: RootState) => state.cart.lines;

export const selectCartUuid = (state: RootState) => state.cart.serverUuid;

export const selectCartHydrated = (state: RootState) => state.cart.hydrated;

/** Сколько всего товаров — для счётчика на плавающей иконке. */
export const selectCartCount = (state: RootState) =>
  state.cart.lines.reduce((sum, l) => sum + l.quantity, 0);

/** Итоговая сумма в рублях. */
export const selectCartTotal = (state: RootState) =>
  state.cart.lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

/** Количество конкретного товара в корзине (0 — нет). Для кнопки на
 *  странице товара: показать «в корзине N» вместо «в корзину». */
export const selectQuantityOf =
  (productId: number) =>
  (state: RootState): number =>
    state.cart.lines.find((l) => l.productId === productId)?.quantity ?? 0;
