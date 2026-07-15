import React, { Suspense } from 'react';
import type { Metadata } from 'next';

import { CategoryView } from './_components/CategoryView/CategoryView';

export const metadata: Metadata = {
  title: 'Каталог',
  description:
    'Коллекции цветочной мастерской «Диво Дивное»: авторские букеты, пионы, моно-букеты, композиции в коробке, свадебная флористика и цветы в вазе.',
};

export default function CatalogPage() {
  // useSearchParams требует Suspense: при сборке параметров ещё нет,
  // они появляются только в браузере. Без границы Next отказывается
  // собирать страницу.
  return (
    <Suspense>
      <CategoryView />
    </Suspense>
  );
}
