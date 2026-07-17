import { apiBaseUrl } from '@/store/api/shopApi';
import type { CartLine } from '@/store/slices/cart';

/** Промокод, принятый сервером: скидка уже посчитана по этой корзине. */
export interface AppliedPromo {
  code: string;
  title: string;
  discount: number;
  subtotal: number;
  total: number;
}

/** Проверяет промокод (POST /promo-codes/check/).
 *
 *  Телефон обязателен: «один раз на клиента» и «только первый заказ»
 *  проверяются по нему, и отказ покупатель должен увидеть здесь, а не
 *  после нажатия «Оформить».
 *
 *  Скидку считает сервер по актуальному прайсу — шлём только id товаров,
 *  количества и выбранные варианты (как и при оформлении). Бросает с
 *  человекочитаемым текстом: его и показываем под полем. */
export async function checkPromo(
  code: string,
  phone: string,
  lines: CartLine[],
): Promise<AppliedPromo> {
  const body = JSON.stringify({
    code,
    phone,
    items: lines.map((l) => ({
      product: l.productId,
      quantity: l.quantity,
      option_values: l.options.map((o) => o.valueId),
    })),
  });

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}promo-codes/check/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch {
    throw new Error('Нет связи с сервером. Попробуйте ещё раз.');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Отказ по существу приезжает в detail («уже использовали», «только
    // для первого заказа»); всё остальное — ошибки валидации по полям.
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? (data as { detail?: string }).detail
        : null;
    throw new Error(detail || 'Промокод не подошёл.');
  }

  return data as AppliedPromo;
}
