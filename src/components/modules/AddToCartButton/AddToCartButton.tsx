'use client';

import React, { FC } from 'react';

import { Button, MinusIcon, PlusIcon } from '@/components/ui';
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

/** «В корзину», а после добавления — степпер количества.
 *
 *  Один товар на странице, поэтому кнопка знает своё текущее количество
 *  из стора и переключает вид сама. Синхронизацию с бэкендом берёт на
 *  себя listener (cartSync) — здесь только диспатчим. */
export const AddToCartButton: FC<Props> = ({ product, className }) => {
  const dispatch = useAppDispatch();
  const quantity = useAppSelector(selectQuantityOf(product.productId));

  if (quantity === 0) {
    return (
      <Button
        color="primary"
        fullWidth
        className={className}
        onClick={() => dispatch(addToCart(product))}
      >
        В корзину
      </Button>
    );
  }

  const setQty = (next: number) =>
    dispatch(setQuantity({ productId: product.productId, quantity: next }));

  return (
    <div className={className} data-in-cart>
      <Stepper
        quantity={quantity}
        onDecrement={() =>
          quantity <= 1
            ? dispatch(removeFromCart(product.productId))
            : setQty(quantity - 1)
        }
        onIncrement={() => setQty(quantity + 1)}
      />
    </div>
  );
};

const Stepper: FC<{
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
}> = ({ quantity, onDecrement, onIncrement }) => (
  <div className={classes.stepper} role="group" aria-label="Количество в корзине">
    <button
      type="button"
      className={classes.step}
      onClick={onDecrement}
      aria-label={quantity <= 1 ? 'Убрать из корзины' : 'Уменьшить количество'}
    >
      <MinusIcon />
    </button>
    <span className={classes.count} aria-live="polite">
      {quantity} в корзине
    </span>
    <button
      type="button"
      className={classes.step}
      onClick={onIncrement}
      aria-label="Увеличить количество"
      disabled={quantity >= 99}
    >
      <PlusIcon />
    </button>
  </div>
);
