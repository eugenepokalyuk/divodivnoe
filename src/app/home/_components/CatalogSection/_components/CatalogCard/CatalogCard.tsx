import React, { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@/utils/consts';

import classes from './CatalogCard.module.scss';

export interface Collection {
  title: string;
  price: string;
  /** Плашка поверх фото: «Хит», «Сезон», «Новинка». */
  note?: string;
}

export const CatalogCard: FC<Collection> = ({ title, price, note }) => (
  <Link href={Routes.Contacts} className={classes.card}>
    {/* Плейсхолдер под фото коллекции. */}
    <span className={classes.media} aria-hidden="true">
      {note && <span className={classes.note}>{note}</span>}
    </span>

    <span className={classes.body}>
      <span className={classes.title}>{title}</span>
      <span className={classes.price}>{price}</span>
    </span>
  </Link>
);
