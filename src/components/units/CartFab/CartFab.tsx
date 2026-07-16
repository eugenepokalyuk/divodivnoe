'use client';

import React from 'react';
import Link from 'next/link';

import { CartIcon } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { selectCartCount } from '@/store/slices/cart';
import { Routes } from '@/utils/consts';

import classes from './CartFab.module.scss';

/** Плавающая иконка корзины справа-снизу.
 *
 *  Появляется, как только в корзине что-то есть, и показывает число
 *  позиций — это и есть «где-то изменится, когда положил товар».
 *  Пустую корзину не показываем: на страницу /cart и так ведёт прямой
 *  переход, а пустой бейдж на всех экранах только мешал бы. */
export const CartFab = () => {
  const count = useAppSelector(selectCartCount);

  if (count === 0) return null;

  return (
    <Link
      href={Routes.Cart}
      className={classes.fab}
      aria-label={`Корзина, товаров: ${count}`}
    >
      <CartIcon className={classes.icon} />
      <span className={classes.badge} aria-hidden>
        {count > 99 ? '99+' : count}
      </span>
    </Link>
  );
};
