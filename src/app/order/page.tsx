import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { OrderStatusView } from './_components/OrderStatusView/OrderStatusView';

export const metadata: Metadata = {
  title: 'Статус заказа',
  description: 'Отслеживание заказа цветочной мастерской «Диво Дивное».',
  // Личная ссылка по токену — в поиске ей делать нечего.
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  // useSearchParams (?id=<токен>) требует Suspense: токена нет на сборке,
  // он приходит в браузере — как и на /cart.
  return (
    <Suspense>
      <OrderStatusView />
    </Suspense>
  );
}
