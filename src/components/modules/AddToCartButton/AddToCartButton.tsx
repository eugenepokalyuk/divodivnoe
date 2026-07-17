'use client';

import React, { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

import { Button, MinusIcon, PlusIcon } from '@/components/ui';
import { flyToCart } from '@/components/units';
import { Goals, reachGoal } from '@/lib/analytics/metrika';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addToCart,
  removeFromCart,
  selectQuantityOf,
  setQuantity,
} from '@/store/slices/cart';
import type { AddToCartPayload } from '@/store/slices/cart';

import classes from './AddToCartButton.module.scss';

interface Props {
  /** Товар в форме позиции корзины — собирает вызывающая сторона. */
  product: AddToCartPayload;
  className?: string;
}

// Плавная смена «В корзину» ↔ степпер. Обе половинки лежат в одном слоте
// фиксированной высоты, поэтому вёрстка не прыгает (была разная высота).
const swap = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: { duration: 0.18, ease: 'easeOut' },
} as const;

export const AddToCartButton: FC<Props> = ({ product, className }) => {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(selectQuantityOf(product.productId));

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (product.image) {
      flyToCart(product.image, event.currentTarget.getBoundingClientRect());
    }
    dispatch(addToCart(product));
    reachGoal(Goals.AddToCart, {
      productId: product.productId,
      price: product.price,
    });
  };

  return (
    <div className={clsx(className, classes.root)}>
      <AnimatePresence initial={false}>
        {quantity === 0 ? (
          <motion.div key="add" className={classes.slot} {...swap}>
            <Button
              color="primary"
              fullWidth
              className={classes.addBtn}
              onClick={handleAdd}
            >
              В корзину
            </Button>
          </motion.div>
        ) : (
          <motion.div key="stepper" className={classes.slot} {...swap}>
            <Stepper
              quantity={quantity}
              onDecrement={() =>
                quantity <= 1
                  ? dispatch(removeFromCart(product.productId))
                  : dispatch(
                      setQuantity({
                        productId: product.productId,
                        quantity: quantity - 1,
                      }),
                    )
              }
              onIncrement={() =>
                dispatch(
                  setQuantity({
                    productId: product.productId,
                    quantity: quantity + 1,
                  }),
                )
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Stepper: FC<{
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ quantity, onDecrement, onIncrement }) => (
  <div
    className={classes.stepper}
    role="group"
    aria-label="Количество в корзине"
  >
    <motion.button
      type="button"
      className={classes.step}
      onClick={onDecrement}
      whileTap={{ scale: 0.8 }}
      aria-label={quantity <= 1 ? 'Убрать из корзины' : 'Уменьшить количество'}
    >
      <MinusIcon />
    </motion.button>

    <span className={classes.count} aria-live="polite">
      <span className={classes.num}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>{' '}
      в корзине
    </span>

    <motion.button
      type="button"
      className={classes.step}
      onClick={onIncrement}
      whileTap={{ scale: 0.8 }}
      aria-label="Увеличить количество"
      disabled={quantity >= 99}
    >
      <PlusIcon />
    </motion.button>
  </div>
);
