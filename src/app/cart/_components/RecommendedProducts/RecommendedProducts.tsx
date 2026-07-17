'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { useGetRecommendedQuery } from '@/store/api/shopApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, selectCartLines, toCartLine } from '@/store/slices/cart';
import { flyToCart } from '@/components/units';
import { PlusIcon } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics/metrika';
import { productRoute } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './RecommendedProducts.module.scss';

/** «Добавить к заказу» под списком корзины: открытка, шары, секатор.
 *
 *  Что показывать — решает галочка «Показывать в „Рекомендуем к заказу“»
 *  в админке. Что уже лежит в корзине, отсеиваем здесь: корзина живёт в
 *  браузере, сервер о ней в этот момент не знает.
 *
 *  Кладём в корзину по клику на карточку целиком, без степпера: это
 *  докупка одной штукой, а количество правится строкой выше — там, куда
 *  товар и уехал. */
export const RecommendedProducts: FC = () => {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const { data: products } = useGetRecommendedQuery();

  const inCart = new Set(lines.map((line) => line.productId));
  const offered = (products ?? []).filter((product) => !inCart.has(product.id));

  // Нечего предложить — блока нет. Пустой заголовок «Рекомендуем» хуже,
  // чем его отсутствие.
  if (offered.length === 0) return null;

  return (
    <section className={classes.root} aria-labelledby="recommended-title">
      <h3 id="recommended-title" className={classes.heading}>
        Добавить к заказу
      </h3>

      <ul className={classes.list}>
        <AnimatePresence initial={false}>
          {offered.map((product) => (
            <motion.li
              key={product.id}
              className={classes.item}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Link
                href={productRoute(product.slug)}
                className={classes.link}
                aria-label={product.name}
              >
                <span className={classes.thumb}>
                  {product.image && (
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="120px"
                      className={classes.image}
                    />
                  )}
                </span>
              </Link>

              <div className={classes.body}>
                <p className={classes.name}>{product.name}</p>
                <p className={classes.price}>{formatPrice(product.price)}</p>
              </div>

              <motion.button
                type="button"
                className={classes.add}
                whileTap={{ scale: 0.85 }}
                aria-label={`Добавить «${product.name}» в корзину`}
                onClick={(event) => {
                  if (product.image) {
                    flyToCart(
                      product.image,
                      event.currentTarget.getBoundingClientRect(),
                    );
                  }
                  // Параметры берутся по умолчанию: здесь их не выбрать,
                  // а поменять можно на странице товара.
                  dispatch(addToCart(toCartLine(product)));
                  reachGoal(Goals.AddToCart, {
                    productId: product.id,
                    price: product.price,
                    from: 'recommended',
                  });
                }}
              >
                <PlusIcon />
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
};
