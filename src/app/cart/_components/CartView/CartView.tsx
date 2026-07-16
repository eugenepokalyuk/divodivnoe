'use client';

import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import {
  Button,
  CheckIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  Section,
} from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCart,
  fetchSharedCart,
  loadCart,
  pushCartToServer,
  removeFromCart,
  selectCartHydrated,
  selectCartLines,
  selectCartTotal,
  selectCartUuid,
  setQuantity,
  setServerUuid,
} from '@/store/slices/cart';
import type { CartLine } from '@/store/slices/cart';
import { Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import { OrderForm } from '../OrderForm/OrderForm';
import type { OrderResult } from '../OrderForm/submitOrder';

import classes from './CartView.module.scss';

export const CartView: FC = () => {
  const dispatch = useAppDispatch();
  const sharedId = useSearchParams().get('id');

  const hydrated = useAppSelector(selectCartHydrated);
  const lines = useAppSelector(selectCartLines);
  const total = useAppSelector(selectCartTotal);
  const uuid = useAppSelector(selectCartUuid);

  const [sharedState, setSharedState] = useState<'idle' | 'loading' | 'missing'>(
    'idle',
  );
  const [placedOrder, setPlacedOrder] = useState<OrderResult | null>(null);

  // Открыли по ссылке «поделиться»: подтягиваем чужую корзину и заменяем ею
  // свою. Не трогаем, если это ссылка на нашу же корзину (uuid совпал).
  useEffect(() => {
    if (!hydrated || !sharedId || sharedId === uuid) return;
    let cancelled = false;
    setSharedState('loading');
    fetchSharedCart(sharedId).then((cart) => {
      if (cancelled) return;
      if (cart) {
        dispatch(loadCart(cart));
        setSharedState('idle');
      } else {
        setSharedState('missing');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, sharedId, uuid, dispatch]);

  // До гидрации из localStorage не рисуем — иначе мелькнёт «корзина пуста».
  if (!hydrated || sharedState === 'loading') {
    return (
      <Section overline="Корзина">
        <div className={classes.placeholder} aria-busy="true" />
      </Section>
    );
  }

  // Заказ оформлен: корзина уже очищена, поэтому этот экран должен идти
  // раньше проверки на пустоту — иначе показали бы «корзина пуста».
  if (placedOrder) {
    return (
      <Section overline="Заказ оформлен" title={`Заказ №${placedOrder.number} принят`}>
        <div className={classes.empty} role="status">
          <p className={classes.empty_text}>
            Спасибо! Флорист свяжется с вами удобным способом, чтобы уточнить
            детали и подтвердить сумму {formatPrice(placedOrder.total)}.
          </p>
          <Button href={Routes.Catalog} variant="outlined">
            Вернуться в каталог
          </Button>
        </div>
      </Section>
    );
  }

  if (sharedState === 'missing') {
    return (
      <Section overline="Корзина" title="Корзина не найдена">
        <div className={classes.empty} role="status">
          <p className={classes.empty_text}>
            Ссылка устарела или корзину уже очистили. Соберите свою — в каталоге
            много всего.
          </p>
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        </div>
      </Section>
    );
  }

  if (lines.length === 0) {
    return (
      <Section overline="Корзина" title="Корзина пуста">
        <div className={classes.empty} role="status">
          <p className={classes.empty_text}>
            Загляните в каталог и добавьте букеты, которые приглянулись.
          </p>
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section overline="Корзина" title="Ваша корзина">
      <div className={classes.layout}>
        <ul className={classes.list}>
          {lines.map((line) => (
            <li key={line.productId} className={classes.item}>
              <span className={classes.thumb}>
                {line.image && (
                  <Image
                    src={line.image}
                    alt=""
                    fill
                    sizes="96px"
                    className={classes.thumbImage}
                  />
                )}
              </span>

              <div className={classes.info}>
                <p className={classes.name}>{line.name}</p>
                <p className={classes.unitPrice}>{formatPrice(line.price)}</p>
              </div>

              <div className={classes.qty} role="group" aria-label={`Количество: ${line.name}`}>
                <button
                  type="button"
                  className={classes.step}
                  aria-label={line.quantity <= 1 ? 'Убрать' : 'Меньше'}
                  onClick={() =>
                    line.quantity <= 1
                      ? dispatch(removeFromCart(line.productId))
                      : dispatch(
                          setQuantity({
                            productId: line.productId,
                            quantity: line.quantity - 1,
                          }),
                        )
                  }
                >
                  <MinusIcon />
                </button>
                <span className={classes.count}>{line.quantity}</span>
                <button
                  type="button"
                  className={classes.step}
                  aria-label="Больше"
                  disabled={line.quantity >= 99}
                  onClick={() =>
                    dispatch(
                      setQuantity({
                        productId: line.productId,
                        quantity: line.quantity + 1,
                      }),
                    )
                  }
                >
                  <PlusIcon />
                </button>
              </div>

              <p className={classes.lineTotal}>
                {formatPrice(line.price * line.quantity)}
              </p>

              <button
                type="button"
                className={classes.remove}
                aria-label={`Удалить ${line.name}`}
                onClick={() => dispatch(removeFromCart(line.productId))}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>

        <aside className={classes.summary}>
          <div className={classes.totalRow}>
            <span>Итого</span>
            <span className={classes.totalValue}>{formatPrice(total)}</span>
          </div>

          <ShareButton
            lines={lines}
            uuid={uuid}
            onUuid={(next) => dispatch(setServerUuid(next))}
          />

          <p className={classes.note}>
            Оплату и доставку флорист уточнит при подтверждении заказа.
          </p>
        </aside>
      </div>

      <div className={classes.checkout}>
        <OrderForm
          lines={lines}
          onSuccess={(result) => {
            dispatch(clearCart());
            setPlacedOrder(result);
          }}
        />
      </div>
    </Section>
  );
};

/** «Поделиться корзиной»: гарантирует, что корзина сохранена на бэкенде
 *  (немедленный синк), и кладёт ссылку /cart/?id=<uuid> в буфер обмена. */
const ShareButton: FC<{
  lines: CartLine[];
  uuid: string | null;
  onUuid: (uuid: string) => void;
}> = ({ lines, uuid, onUuid }) => {
  const [state, setState] = useState<'idle' | 'saving' | 'copied' | 'error'>(
    'idle',
  );

  const share = async () => {
    setState('saving');
    const nextUuid = await pushCartToServer(lines, uuid);
    if (!nextUuid) {
      setState('error');
      return;
    }
    if (nextUuid !== uuid) onUuid(nextUuid);

    const link = `${window.location.origin}${Routes.Cart}/?id=${nextUuid}`;
    try {
      await navigator.clipboard.writeText(link);
      setState('copied');
      setTimeout(() => setState('idle'), 2500);
    } catch {
      // Буфер недоступен (нет https/разрешения) — показываем ссылку, скопирует руками.
      window.prompt('Скопируйте ссылку на корзину:', link);
      setState('idle');
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      onClick={share}
      disabled={state === 'saving'}
    >
      {state === 'saving'
        ? 'Готовим ссылку…'
        : state === 'copied'
          ? (
              <>
                Ссылка скопирована <CheckIcon />
              </>
            )
          : state === 'error'
            ? 'Не вышло, попробуйте ещё'
            : 'Поделиться корзиной'}
    </Button>
  );
};
