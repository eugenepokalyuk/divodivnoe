import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { ProductView } from './_components/ProductView/ProductView';

export const metadata: Metadata = {
  title: 'Товар',
  description:
    'Авторский букет цветочной мастерской «Диво Дивное». Фото, состав и цена.',
};

export default function ProductPage() {
  // useSearchParams требует Suspense: на сборке slug ещё нет, он появляется
  // только в браузере. Без границы Next отказывается собирать страницу
  // (та же причина, что и на /catalog/page.tsx).
  return (
    <Suspense>
      <ProductView />
    </Suspense>
  );
}
