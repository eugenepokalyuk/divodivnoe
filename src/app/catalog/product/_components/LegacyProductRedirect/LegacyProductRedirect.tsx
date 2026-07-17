'use client';

import { FC, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button, Section } from '@/components/ui';
import { productRoute, Routes } from '@/utils/consts';

/** Переадресация со старого /catalog/product/?slug=… на ЧПУ.
 *
 *  replace, а не push: старый адрес не должен оставаться в истории «назад».
 *  Нет slug — уводим в каталог. Пока редирект отрабатывает, показываем
 *  нейтральную заглушку, а не пустой экран. */
export const LegacyProductRedirect: FC = () => {
  const router = useRouter();
  const slug = useSearchParams().get('slug');

  useEffect(() => {
    router.replace(slug ? productRoute(slug) : Routes.Catalog);
  }, [router, slug]);

  return (
    <Section overline="Каталог" title="Открываем товар…">
      <Button href={Routes.Catalog} variant="outlined">
        В каталог
      </Button>
    </Section>
  );
};
