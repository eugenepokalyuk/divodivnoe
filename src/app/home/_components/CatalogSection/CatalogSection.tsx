'use client';

import React, { FC } from 'react';

import { Section } from '@/components/ui';
import { useGetCategoriesQuery } from '@/store/api/shopApi';

import { CatalogCard } from './_components/CatalogCard/CatalogCard';
import { CatalogCardSkeleton } from './_components/CatalogCardSkeleton/CatalogCardSkeleton';
import { CatalogError } from './_components/CatalogError/CatalogError';

import classes from './CatalogSection.module.scss';

/** Сколько заглушек рисовать, пока едут данные. Шесть — столько коллекций
 *  сейчас в админке. Если число изменится, разъедется только первый кадр
 *  загрузки, вёрстка не пострадает. */
const SKELETON_COUNT = 6;

/** Каталога нет в исходном HTML: сайт — статика на Pages, а коллекции
 *  живут в админке и приезжают с api.divodivnoe.com уже в браузере.
 *  Поэтому здесь три состояния: загрузка, ошибка и данные. */
export const CatalogSection: FC = () => {
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();

  // Пустой каталог под заголовком «Выберите настроение» читается как
  // поломка. Нет коллекций в админке — нет секции.
  if (!isLoading && !isError && !categories?.length) return null;

  return (
    <Section
      id="catalog"
      overline="Каталог"
      title="Выберите настроение"
      description="Собираем букеты из свежего среза — привозим цветы дважды в неделю. Каждая композиция собирается вручную под ваш повод."
    >
      {isError ? (
        <CatalogError />
      ) : (
        <ul className={classes.grid} aria-busy={isLoading}>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <CatalogCardSkeleton key={index} />
              ))
            : categories?.map((category) => (
                <li key={category.slug}>
                  <CatalogCard
                    title={category.name}
                    priceFrom={category.price_from}
                    note={category.note || undefined}
                    image={category.image}
                  />
                </li>
              ))}
        </ul>
      )}
    </Section>
  );
};
