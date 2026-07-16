'use client';

import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { CartIcon } from '@/components/ui';
import { useAppSelector } from '@/store/hooks';
import { selectCartCount } from '@/store/slices/cart';
import { Routes } from '@/utils/consts';

import classes from './CartFab.module.scss';

const MotionLink = motion.create(Link);

/** Плавающая иконка корзины справа-снизу.
 *
 *  Появляется, как только в корзине что-то есть, и показывает число позиций.
 *  Плавно въезжает/уезжает (AnimatePresence), а бейдж подпрыгивает при каждой
 *  смене количества. data-cart-fab — цель для анимации «полёт в корзину». */
export const CartFab = () => {
  const count = useAppSelector(selectCartCount);

  return (
    <AnimatePresence>
      {count > 0 && (
        <MotionLink
          href={Routes.Cart}
          data-cart-fab
          className={classes.fab}
          aria-label={`Корзина, товаров: ${count}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          whileTap={{ scale: 0.9 }}
        >
          <CartIcon className={classes.icon} />
          <motion.span
            key={count}
            className={classes.badge}
            aria-hidden
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 18 }}
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        </MotionLink>
      )}
    </AnimatePresence>
  );
};
