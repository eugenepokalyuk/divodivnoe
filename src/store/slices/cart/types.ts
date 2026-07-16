/** Позиция корзины на клиенте.
 *
 *  Держим снимок названия/цены/фото, а не только id: корзина рисуется
 *  мгновенно из localStorage, без ожидания ответа бэкенда. Актуальную
 *  цену подтверждает бэкенд при открытии по ссылке и при оформлении
 *  заказа — там она и фиксируется. */
export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  /** UUID корзины на бэкенде — он же ключ ссылки «поделиться».
   *  null, пока корзина ни разу не синхронизировалась. */
  serverUuid: string | null;
  /** Прочитали ли localStorage. До этого не пишем обратно и не синхроним,
   *  иначе первый же экран затёр бы сохранённую корзину пустой. */
  hydrated: boolean;
}

/** Что кладём в корзину: строка без количества (его задаёт reducer). */
export type AddToCartPayload = Omit<CartLine, 'quantity'> & {
  quantity?: number;
};
