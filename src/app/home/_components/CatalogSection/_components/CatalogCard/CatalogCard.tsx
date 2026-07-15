import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Routes } from '@/utils/consts';
import { formatPriceFrom } from '@/utils/helpers';

import classes from './CatalogCard.module.scss';

export interface Collection {
  title: string;
  /** Минимальная цена в рублях числом — форматируем на месте, чтобы
   *  бэкенд не решал, как выглядит витрина. */
  priceFrom: number;
  /** Плашка поверх фото: «Хит», «Сезон», «Новинка». */
  note?: string;
  /** Абсолютная ссылка на фото с бэкенда. Модель фото требует, но пустое
   *  значение уронило бы next/image вместе со всей страницей — поэтому
   *  допускаем null и показываем пустую рамку. */
  image: string | null;
}

export const CatalogCard: FC<Collection> = ({
  title,
  priceFrom,
  note,
  image,
}) => (
  <Link href={Routes.Contacts} className={classes.card}>
    <span className={classes.media}>
      {image && (
        <Image
          src={image}
          // Название коллекции ссылка уже озвучивает — фото декоративное.
          alt=""
          fill
          sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className={classes.image}
        />
      )}

      {note && <span className={classes.note}>{note}</span>}
    </span>

    <span className={classes.body}>
      <span className={classes.title}>{title}</span>
      <span className={classes.price}>{formatPriceFrom(priceFrom)}</span>
    </span>
  </Link>
);
