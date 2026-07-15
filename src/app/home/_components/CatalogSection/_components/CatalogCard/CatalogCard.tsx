import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Routes } from '@/utils/consts';

import classes from './CatalogCard.module.scss';

export interface Collection {
  title: string;
  price: string;
  /** Плашка поверх фото: «Хит», «Сезон», «Новинка». */
  note?: string;
  /** Путь от корня public, например /photos/catalog/piony.webp. */
  image: string;
}

export const CatalogCard: FC<Collection> = ({ title, price, note, image }) => (
  <Link href={Routes.Contacts} className={classes.card}>
    <span className={classes.media}>
      <Image
        src={image}
        // Название коллекции ссылка уже озвучивает — фото декоративное.
        alt=""
        fill
        sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
        className={classes.image}
      />

      {note && <span className={classes.note}>{note}</span>}
    </span>

    <span className={classes.body}>
      <span className={classes.title}>{title}</span>
      <span className={classes.price}>{price}</span>
    </span>
  </Link>
);
