/** Номер счётчика Яндекс.Метрики. Задаётся на сборке через окружение
 *  (workflow → NEXT_PUBLIC_YM_COUNTER_ID). Пусто — Метрика не подключается
 *  вовсе: ни счётчика, ни целей, ни кук. Так на локали и до выдачи номера
 *  аналитики просто нет. */
export const YM_COUNTER_ID = process.env.NEXT_PUBLIC_YM_COUNTER_ID ?? '';

type YmFn = (id: string | number, method: string, ...args: unknown[]) => void;

function ym(): YmFn | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { ym?: YmFn }).ym;
}

/** Просмотр «страницы» при SPA-переходе. Счётчик инициализируется с
 *  defer:true, поэтому первый и последующие показы отправляем вручную. */
export function ymHit(url: string): void {
  if (!YM_COUNTER_ID) return;
  ym()?.(YM_COUNTER_ID, 'hit', url);
}

/** Достижение цели: добавление в корзину, оформление и т. п. No-op, пока
 *  счётчик не задан или скрипт ещё не загрузился — вызовам это безопасно. */
export function reachGoal(
  goal: string,
  params?: Record<string, unknown>,
): void {
  if (!YM_COUNTER_ID) return;
  ym()?.(YM_COUNTER_ID, 'reachGoal', goal, params);
}

interface EcommerceProduct {
  id: string | number;
  name: string;
  /** Цена за штуку, ₽ (уже с прибавками за параметры). */
  price: number;
  quantity: number;
}

/** Отправляет покупку в e-commerce Метрики через dataLayer (счётчик
 *  инициализирован с ecommerce:"dataLayer"). Так в отчётах появляются
 *  доход и состав заказа, а не только факт цели checkout.
 *
 *  revenue — итог со скидкой (реальные деньги). Состав — позиции корзины;
 *  подарок и скидку по позициям не расписываем, для отчёта о доходе важен
 *  actionField.revenue. */
export function ecommercePurchase(input: {
  id: string | number;
  revenue: number;
  products: EcommerceProduct[];
}): void {
  if (!YM_COUNTER_ID || typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    ecommerce: {
      currencyCode: 'RUB',
      purchase: {
        actionField: { id: String(input.id), revenue: input.revenue },
        products: input.products,
      },
    },
  });
}

/** Названия целей — в одном месте, чтобы совпадали с настройкой целей в
 *  интерфейсе Метрики и не разъезжались по опечаткам. */
export const Goals = {
  ViewProduct: 'view_product',
  AddToCart: 'add_to_cart',
  Checkout: 'checkout',
  /** Клик «написать флористу» (Telegram/WhatsApp/MAX) — прямая конверсия
   *  для лид-модели: многие пишут, а не оформляют онлайн. */
  ContactClick: 'contact_click',
  /** Отправлена заявка «Намекнуть о подарке». */
  GiftHint: 'gift_hint',
  /** Промокод принят на оформлении. */
  PromoApplied: 'promo_applied',
  /** Нажали «Поделиться корзиной». */
  ShareCart: 'share_cart',
} as const;
