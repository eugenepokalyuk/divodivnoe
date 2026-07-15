import React, { FC } from 'react';

import { Skeleton } from '@/components/ui';

import classes from './ProductCardSkeleton.module.scss';

/** Заглушка карточки товара. Геометрия повторяет ProductCard, чтобы
 *  при подмене вёрстка не дёрнулась. */
export const ProductCardSkeleton: FC = () => (
  <li className={classes.card}>
    <Skeleton className={classes.media} height="auto" />

    <span className={classes.body}>
      <Skeleton width="65%" height="1.4em" radius="4px" />
      <Skeleton width="35%" height="1.2em" radius="4px" />
    </span>
  </li>
);
