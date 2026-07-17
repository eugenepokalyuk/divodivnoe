import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { LegacyProductRedirect } from './_components/LegacyProductRedirect/LegacyProductRedirect';

export const metadata: Metadata = {
  title: 'Товар',
  // Старый адрес-редирект в индексе не нужен — канонические страницы товара
  // лежат на /catalog/product/<slug>/.
  robots: { index: false, follow: true },
};

/** Старый адрес /catalog/product/?slug=… остаётся ради ссылок, отправленных
 *  до перехода на ЧПУ (уведомления о заказах в телеграме). Просто
 *  переадресует на каноническую страницу товара. */
export default function LegacyProductPage() {
  return (
    <Suspense>
      <LegacyProductRedirect />
    </Suspense>
  );
}
