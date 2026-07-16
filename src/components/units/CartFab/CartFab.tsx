'use client';

import React from 'react';
import Link from 'next/link';

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
    <Link href={Routes.Cart} className={classes.fab} aria-label={`Корзина, товаров: ${count}`}>
      <CartIcon />
      <span className={classes.badge} aria-hidden>
        {count > 99 ? '99+' : count}
      </span>
    </Link>
  );
};

const CartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3h2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
  </svg>
);
