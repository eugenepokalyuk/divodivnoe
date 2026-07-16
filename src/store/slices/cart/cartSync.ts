import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import { apiBaseUrl } from '@/store/api/shopApi';
import type { AppDispatch, RootState } from '@/store/store';

import { cartActions } from './cartSlice';
import type { CartLine } from './types';

export const CART_STORAGE_KEY = 'divo_cart_v1';

const isBrowser = typeof window !== 'undefined';

/** Ответ бэкенда: см. orders/serializers.py (CartSerializer). */
interface ServerCart {
  uuid: string;
  items: {
    product: {
      id: number;
      name: string;
      slug: string;
      price: number;
      image: string | null;
    };
    quantity: number;
  }[];
  total: number;
}

const toLines = (cart: ServerCart): CartLine[] =>
  cart.items.map((i) => ({
    productId: i.product.id,
    slug: i.product.slug,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    quantity: i.quantity,
  }));

const toItems = (lines: CartLine[]) =>
  lines.map((l) => ({ product: l.productId, quantity: l.quantity }));

// === Публичные хелперы ===

/** Читает сохранённую корзину для гидрации на старте. */
export function loadPersistedCart(): {
  lines: CartLine[];
  serverUuid: string | null;
} {
  if (!isBrowser) return { lines: [], serverUuid: null };
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { lines: [], serverUuid: null };
    const parsed = JSON.parse(raw);
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      serverUuid: parsed.serverUuid ?? null,
    };
  } catch {
    return { lines: [], serverUuid: null };
  }
}

/** Забирает чужую корзину по ссылке «поделиться». null — не нашлась. */
export async function fetchSharedCart(
  uuid: string,
): Promise<{ lines: CartLine[]; serverUuid: string } | null> {
  try {
    const res = await fetch(`${apiBaseUrl}cart/${uuid}/`);
    if (!res.ok) return null;
    const cart: ServerCart = await res.json();
    return { lines: toLines(cart), serverUuid: cart.uuid };
  } catch {
    return null;
  }
}

// === Внутреннее ===

function persist(state: RootState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        lines: state.cart.lines,
        serverUuid: state.cart.serverUuid,
      }),
    );
  } catch {
    // Приватный режим/переполнение — не роняем корзину из-за стореджа.
  }
}

/** Отправляет корзину на бэкенд. Возвращает актуальный uuid.
 *  Нет uuid → POST (создаём). Есть → PUT (заменяем). PUT вернул 404
 *  (корзину удалили на сервере) → создаём заново.
 *
 *  Экспортируется как pushCartToServer: кнопка «Поделиться» вызывает синк
 *  немедленно, не дожидаясь дебаунса listener'а, чтобы ссылка была готова
 *  сразу. */
export async function pushCartToServer(
  lines: CartLine[],
  uuid: string | null,
): Promise<string | null> {
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ items: toItems(lines) });
  try {
    if (uuid) {
      const res = await fetch(`${apiBaseUrl}cart/${uuid}/`, {
        method: 'PUT',
        headers,
        body,
      });
      if (res.ok) return uuid;
      // Не 404 — временная ошибка, uuid не меняем, синхронизируемся позже.
      if (res.status !== 404) return uuid;
    }
    const res = await fetch(`${apiBaseUrl}cart/`, {
      method: 'POST',
      headers,
      body,
    });
    if (!res.ok) return uuid;
    const cart: ServerCart = await res.json();
    return cart.uuid;
  } catch {
    return uuid;
  }
}

export const cartListener = createListenerMiddleware();

const startListening = cartListener.startListening.withTypes<
  RootState,
  AppDispatch
>();

// Любое изменение состава корзины: сохраняем локально и (с дебаунсом)
// отправляем на бэкенд, чтобы ссылка «поделиться» всегда была свежей.
startListening({
  matcher: isAnyOf(
    cartActions.addToCart,
    cartActions.setQuantity,
    cartActions.removeFromCart,
    cartActions.clearCart,
    cartActions.loadCart,
  ),
  effect: async (_action, api) => {
    // До гидрации из localStorage не синхронизируем: иначе пустой стартовый
    // стейт затёр бы и сохранённую, и серверную корзину.
    if (!api.getState().cart.hydrated) return;

    persist(api.getState());

    // Дебаунс: быстрые клики «+/−» шлём одним запросом.
    api.cancelActiveListeners();
    await api.delay(600);

    const { lines, serverUuid } = api.getState().cart;
    const nextUuid = await pushCartToServer(lines, serverUuid);
    if (nextUuid && nextUuid !== serverUuid) {
      api.dispatch(cartActions.setServerUuid(nextUuid));
    }
  },
});

// Появился серверный uuid — сразу кладём в localStorage, чтобы после
// перезагрузки продолжить синхронизировать ту же корзину, а не плодить новую.
startListening({
  actionCreator: cartActions.setServerUuid,
  effect: (_action, api) => persist(api.getState()),
});
