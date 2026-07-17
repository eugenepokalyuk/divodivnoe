'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import { useGetGiftRuleQuery } from '@/store/api/shopApi';
import { useAppSelector } from '@/store/hooks';
import { giftGap, isGiftEarned, selectCartLines } from '@/store/slices/cart';
import { formatPrice } from '@/utils/helpers';

import classes from './GiftLine.module.scss';

/** Подарок к дорогому букету — в списке корзины, последней строкой.
 *
 *  Пока не заработан, показываем, сколько не хватает, — но только если в
 *  корзине уже есть букет: советовать «добавьте на 5 000 ₽» тому, кто
 *  покупает одну открытку, незачем.
 *
 *  Строка не редактируется и не считается в сумму: подарок кладёт сервер
 *  при оформлении, здесь он только показан (см. store/slices/cart/gift). */
export const GiftLine: FC = () => {
  const lines = useAppSelector(selectCartLines);
  const { data: rule } = useGetGiftRuleQuery();

  if (!rule) return null;

  const earned = isGiftEarned(lines, rule);
  const gap = giftGap(lines, rule);

  if (!earned && gap === null) return null;

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={earned ? 'earned' : 'gap'}
        className={classes.root}
        data-earned={earned}
        layout
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        role="status"
      >
        <span className={classes.thumb}>
          {rule.product.image && (
            <Image
              src={rule.product.image}
              alt=""
              fill
              sizes="72px"
              className={classes.image}
            />
          )}
        </span>

        <div className={classes.body}>
          <p className={classes.name}>
            {earned ? '🎁 ' : ''}
            {rule.product.name}
          </p>
          <p className={classes.note}>
            {earned
              ? 'В подарок к вашему букету'
              : `До подарка не хватает ${formatPrice(gap as number)} — к букету от ${formatPrice(rule.threshold)}`}
          </p>
        </div>

        <p className={classes.price}>
          {earned ? (
            <span className={classes.free}>Бесплатно</span>
          ) : (
            <s className={classes.struck}>{formatPrice(rule.product.price)}</s>
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
