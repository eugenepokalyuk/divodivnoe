'use client';

import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

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

import { GiftLine } from '../GiftLine/GiftLine';
import type { AppliedPromo } from '../OrderForm/checkPromo';
import { OrderForm } from '../OrderForm/OrderForm';
import type { OrderResult } from '../OrderForm/submitOrder';
import { RecommendedProducts } from '../RecommendedProducts/RecommendedProducts';

import classes from './CartView.module.scss';

export const CartView: FC = () => {
  const dispatch = useAppDispatch();
  const sharedId = useSearchParams().get('id');

  const hydrated = useAppSelector(selectCartHydrated);
  const lines = useAppSelector(selectCartLines);
  const total = useAppSelector(selectCartTotal);
  const uuid = useAppSelector(selectCartUuid);

  const [sharedState, setSharedState] = useState<
    'idle' | 'loading' | 'missing'
  >('idle');
  const [placedOrder, setPlacedOrder] = useState<OrderResult | null>(null);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);

  // Скидку сервер посчитал под тот состав корзины, что был на момент
  // «Применить». Состав поменялся — прежняя сумма скидки уже неверна
  // (10% от другой корзины — другие деньги), поэтому сбрасываем и просим
  // применить заново. Сервер при оформлении всё равно пересчитает сам,
  // но показывать до этого неправду нельзя.
  const linesKey = JSON.stringify(
    lines.map((l) => [l.productId, l.quantity, l.price]),
  );
  useEffect(() => {
    setPromo(null);
  }, [linesKey]);

  const discount = promo?.discount ?? 0;
  const totalWithDiscount = Math.max(total - discount, 0);

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
      <Section
        overline="Заказ оформлен"
        title={`Заказ №${placedOrder.number} принят`}
      >
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
        <div className={classes.main}>
          <ul className={classes.list}>
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <motion.li
                  key={line.productId}
                  className={classes.item}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
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

                    {/* Выбранные параметры: покупатель должен видеть на
                      оформлении, что именно уедет флористу. Менять их
                      здесь нельзя — для этого есть страница товара. */}
                    {line.options.length > 0 && (
                      <ul className={classes.options}>
                        {line.options.map((option) => (
                          <li key={option.valueId} className={classes.option}>
                            {option.name}: <b>{option.value}</b>
                            {option.priceDelta > 0 &&
                              ` (+${formatPrice(option.priceDelta)})`}
                          </li>
                        ))}
                      </ul>
                    )}

                    <p className={classes.unitPrice}>
                      {formatPrice(line.price)}
                    </p>
                  </div>

                  <div
                    className={classes.qty}
                    role="group"
                    aria-label={`Количество: ${line.name}`}
                  >
                    <motion.button
                      type="button"
                      className={classes.step}
                      whileTap={{ scale: 0.8 }}
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
                    </motion.button>
                    <span className={classes.count}>{line.quantity}</span>
                    <motion.button
                      type="button"
                      className={classes.step}
                      whileTap={{ scale: 0.8 }}
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
                    </motion.button>
                  </div>

                  <p className={classes.lineTotal}>
                    {formatPrice(line.price * line.quantity)}
                  </p>

                  <motion.button
                    type="button"
                    className={classes.remove}
                    whileTap={{ scale: 0.85 }}
                    aria-label={`Удалить ${line.name}`}
                    onClick={() => dispatch(removeFromCart(line.productId))}
                  >
                    <CloseIcon />
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <GiftLine />
          <RecommendedProducts />
        </div>

        <aside className={classes.summary}>
          {/* Сумму без скидки показываем только когда есть что вычитать —
              иначе это лишняя строка, дублирующая «Итого». */}
          <AnimatePresence initial={false}>
            {discount > 0 && (
              <motion.div
                className={classes.discountRows}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className={classes.subRow}>
                  <span>Сумма</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className={classes.subRow} data-discount="true">
                  <span>Промокод {promo?.code}</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={classes.totalRow}>
            <span>Итого</span>
            <motion.span
              key={totalWithDiscount}
              className={classes.totalValue}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            >
              {formatPrice(totalWithDiscount)}
            </motion.span>
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
          promo={promo}
          onPromo={setPromo}
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
      {state === 'saving' ? (
        'Готовим ссылку…'
      ) : state === 'copied' ? (
        <>
          Ссылка скопирована <CheckIcon />
        </>
      ) : state === 'error' ? (
        'Не вышло, попробуйте ещё'
      ) : (
        'Поделиться корзиной'
      )}
    </Button>
  );
};
