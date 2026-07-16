import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { CartView } from './_components/CartView/CartView';

export const metadata: Metadata = {
  title: 'Корзина',
  description: 'Ваша корзина в цветочной мастерской «Диво Дивное».',
};

export default function CartPage() {
  // useSearchParams (?id=<uuid> для открытия чужой корзины) требует Suspense:
  // параметра нет на сборке, он появляется в браузере — как и на /catalog.
  return (
    <Suspense>
      <CartView />
    </Suspense>
  );
}
