import React, { FC } from 'react';

import { Skeleton } from '@/components/ui';

import classes from './PromotionCardSkeleton.module.scss';

/** Заглушка карточки акции. Повторяет геометрию настоящей, чтобы при
 *  подмене вёрстка не дёрнулась. */
export const PromotionCardSkeleton: FC = () => (
  <li className={classes.card}>
    <Skeleton width="72px" height="32px" radius="999px" />

    <span className={classes.body}>
      <Skeleton width="80%" height="1.5em" radius="4px" />
      <Skeleton height="1em" radius="4px" />
      <Skeleton width="60%" height="1em" radius="4px" />
    </span>

    <Skeleton height="44px" radius="8px" />

    <span className={classes.footer}>
      <Skeleton width="96px" height="0.9em" radius="4px" />
      <Skeleton height="36px" radius="999px" />
    </span>
  </li>
);
