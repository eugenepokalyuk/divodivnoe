import { apiBaseUrl } from '@/store/api/shopApi';
import type { CartLine } from '@/store/slices/cart';

import type { ContactMethod } from './orderSchema';

interface SubmitInput {
  firstName: string;
  lastName: string;
  phone: string;
  contactMethod: ContactMethod;
  comment?: string;
  lines: CartLine[];
}

export interface OrderResult {
  number: number;
  total: number;
}

/** Отправляет заказ на бэкенд (POST /orders/).
 *
 *  Шлём id товаров и количества — цены и сумму считает сервер, ему и
 *  верить (см. OrderSerializer). Возвращает номер и сумму заказа либо
 *  бросает с человекочитаемым текстом для показа в форме. */
export async function submitOrder(input: SubmitInput): Promise<OrderResult> {
  const body = JSON.stringify({
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone,
    contact_method: input.contactMethod,
    comment: input.comment ?? '',
    items_input: input.lines.map((l) => ({
      product: l.productId,
      quantity: l.quantity,
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
    throw new Error('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.');
  }

  if (!res.ok) {
    // Бэкенд отдаёт ошибки валидации по полям — покажем первую понятную.
    let message = 'Не удалось оформить заказ. Попробуйте ещё раз.';
    try {
      const data = await res.json();
      const first = Object.values(data)[0];
      if (Array.isArray(first) && typeof first[0] === 'string') message = first[0];
      else if (typeof first === 'string') message = first;
    } catch {
      // тело не JSON — оставляем общий текст
    }
    throw new Error(message);
  }

  const data = await res.json();
  return { number: data.number, total: data.total };
}
