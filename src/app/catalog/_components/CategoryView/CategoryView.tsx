'use client';

import React, { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button, MessengerActions, Section } from '@/components/ui';
import { useGetCategoryQuery } from '@/store/api/shopApi';
import { CompanyDomain, Routes } from '@/utils/consts';

import { ProductCard } from '../ProductCard/ProductCard';
import { ProductCardSkeleton } from '../ProductCardSkeleton/ProductCardSkeleton';

import classes from './CategoryView.module.scss';

const SKELETON_COUNT = 6;

/** Страница категории: /catalog/?category=piony
 *
 *  Категория и товары приезжают с бэкенда уже в браузере — сайт статика,
 *  и в исходном HTML их нет. Поэтому состояний много, и каждое должно
 *  вести к флористу: посетитель пришёл за букетом, а не за диагностикой.
 */
export const CategoryView: FC = () => {
  const slug = useSearchParams().get('category') ?? '';

  const {
    data: category,
    isLoading,
    isError,
    error,
  } = useGetCategoryQuery(slug, { skip: !slug });

  // Зашли на /catalog/ без параметра — руками или по старой ссылке.
  if (!slug) {
    return (
      <Fallback
        title="Выберите коллекцию"
        text="Откройте каталог на главной и выберите, что вам по настроению."
        action={
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <Section overline="Каталог">
        <ul className={classes.grid} aria-busy="true">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </ul>
      </Section>
    );
  }

  // 404 от бэкенда — категорию скрыли в админке или ссылка устарела.
  // Это не поломка, и пугать посетителя ошибкой незачем.
  const isMissing = isError && (error as { status?: number })?.status === 404;

  if (isMissing) {
    return (
      <Fallback
        title="Такой коллекции больше нет"
        text="Возможно, сезон закончился. Загляните в каталог — соберём что-нибудь не хуже."
        action={
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        }
      />
    );
  }

  if (isError || !category) {
    return (
      <Fallback
        title="Не получилось загрузить"
        text="Напишите флористу — подберём букет и пришлём фото до отправки."
        action={<MessengerActions message={greeting} />}
      />
    );
  }

  return (
    <Section
      overline="Каталог"
      title={category.name}
      description={category.description || undefined}
    >
      {category.products.length ? (
        <ul className={classes.grid}>
          {category.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </ul>
      ) : (
        // Категория есть, товаров ещё нет: флорист завёл коллекцию,
        // но не наполнил. Пустая сетка выглядела бы поломкой.
        <p className={classes.pending}>
          Собираем эту коллекцию — напишите, и флорист покажет, что есть сейчас.
        </p>
      )}

      <div className={classes.footer}>
        <p className={classes.hint}>Понравился букет? Напишите флористу:</p>
        <MessengerActions
          message={`${greeting} Интересует коллекция «${category.name}»`}
          className={classes.actions}
        />
      </div>
    </Section>
  );
};

const greeting = `Здравствуйте! Я с сайта ${CompanyDomain}.`;

const Fallback: FC<{
  title: string;
  text: string;
  action: React.ReactNode;
}> = ({ title, text, action }) => (
  <Section overline="Каталог" title={title}>
    <div className={classes.fallback} role="status">
      <p className={classes.fallback_text}>{text}</p>
      {action}
    </div>
  </Section>
);
