/** Оформленные заказы, сохранённые на устройстве.
 *
 *  Логина нет, поэтому «мои заказы» держим в localStorage: номер + токен
 *  ссылки на статус. Это не право доступа (оно — в самом токене), а просто
 *  памятка, чтобы покупатель нашёл свои заказы, вернувшись на сайт. */

const KEY = 'divo_orders_v1';
const MAX = 20;

export interface SavedOrder {
  number: number;
  token: string;
  /** ISO-время оформления — для сортировки и подписи. */
  at: string;
}

const isBrowser = typeof window !== 'undefined';

export function loadSavedOrders(): SavedOrder[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((o) => o && typeof o.token === 'string')
      : [];
  } catch {
    return [];
  }
}

/** Добавляет заказ в начало списка. Дубли по токену не плодим, список
 *  подрезаем — старые заказы покупателю уже не интересны. */
export function saveOrder(order: SavedOrder): void {
  if (!isBrowser) return;
  try {
    const rest = loadSavedOrders().filter((o) => o.token !== order.token);
    const next = [order, ...rest].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // приватный режим/переполнение — памятка не критична
  }
}
