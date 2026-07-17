import { apiBaseUrl } from '@/store/api/shopApi';
import type { CartLine } from '@/store/slices/cart';

import type { ContactMethod } from './orderSchema';

interface SubmitInput {
  firstName: string;
  lastName: string;
  phone: string;
  contactMethod: ContactMethod;
  /** @username клиента, если выбран Telegram. Для кнопки связи у флориста. */
  telegramUsername?: string;
  comment?: string;
  lines: CartLine[];
  /** Код применённого промокода. Сервер проверит его заново: между
   *  «Применить» и «Оформить» корзина могла поменяться. */
  promoCode?: string;
}

export interface OrderResult {
  number: number;
  total: number;
  /** Токен для ссылки «отслеживать заказ» (страница /order/). */
  publicToken: string;
}

/** Отправляет заказ на бэкенд (POST /orders/).
 *
 *  Шлём id товаров, количества и выбранные варианты параметров — цены,
 *  скидку и подарок считает сервер, ему и верить (см. OrderSerializer).
 *  Возвращает номер и сумму заказа либо бросает с человекочитаемым
 *  текстом для показа в форме. */
export async function submitOrder(input: SubmitInput): Promise<OrderResult> {
  const body = JSON.stringify({
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone,
    contact_method: input.contactMethod,
    telegram_username: input.telegramUsername ?? '',
    comment: input.comment ?? '',
    promo_code_input: input.promoCode ?? '',
    items_input: input.lines.map((l) => ({
      product: l.productId,
      quantity: l.quantity,
      option_values: l.options.map((o) => o.valueId),
    })),
  });

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch {
    throw new Error(
      'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.',
    );
  }

  if (!res.ok) {
    // Бэкенд отдаёт ошибки валидации по полям — покажем первую понятную.
    let message = 'Не удалось оформить заказ. Попробуйте ещё раз.';
    try {
      const data = await res.json();
      const first = Object.values(data)[0];
      if (Array.isArray(first) && typeof first[0] === 'string')
        message = first[0];
      else if (typeof first === 'string') message = first;
    } catch {
      // тело не JSON — оставляем общий текст
    }
    throw new Error(message);
  }

  const data = await res.json();
  return {
    number: data.number,
    total: data.total,
    publicToken: data.public_token,
  };
}
