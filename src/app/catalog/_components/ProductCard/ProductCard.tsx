import React, { FC } from 'react';
import Image from 'next/image';

import type { ProductDto } from '@/store/api/shopApi';
import { formatPrice } from '@/utils/helpers';

import classes from './ProductCard.module.scss';

interface Props {
  product: ProductDto;
}

export const ProductCard: FC<Props> = ({ product }) => (
  <li className={classes.card}>
    <span className={classes.media}>
      {product.image && (
        <Image
          src={product.image}
          // Название букета идёт текстом рядом — дублировать его в alt
          // значит заставить скринридер прочитать одно и то же дважды.
          alt=""
          fill
          sizes="(max-width: 479px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className={classes.image}
        />
      )}
    </span>

    <span className={classes.body}>
      <h3 className={classes.title}>{product.name}</h3>
      {product.description && (
        <p className={classes.description}>{product.description}</p>
      )}
      <p className={classes.price}>{formatPrice(product.price)}</p>
    </span>
  </li>
);
