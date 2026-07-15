import React, { FC } from 'react';

import { Skeleton } from '@/components/ui';

import classes from './CatalogCardSkeleton.module.scss';

/** Заглушка карточки на время загрузки. Повторяет геометрию настоящей
 *  один в один: те же пропорции фото, те же высоты строк — поэтому когда
 *  приедут данные, ничего не прыгнет. */
export const CatalogCardSkeleton: FC = () => (
  <li className={classes.card}>
    <Skeleton className={classes.media} height="auto" />

    <span className={classes.body}>
      <Skeleton width="70%" height="1.4em" radius="4px" />
      <Skeleton width="40%" height="1em" radius="4px" />
    </span>
  </li>
);
