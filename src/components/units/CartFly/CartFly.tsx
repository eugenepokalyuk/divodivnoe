'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import classes from './CartFly.module.scss';

const EVENT = 'cart-fly';

interface FlyDetail {
  image: string;
  rect: { top: number; left: number; width: number; height: number };
}

interface FlyItem extends FlyDetail {
  id: number;
}

let counter = 0;

/** Запускает анимацию «товар летит в корзину».
 *
 *  Кнопка «В корзину» знает картинку и своё положение на экране, а слой
 *  CartFlyLayer (в Layout) рисует летящий клон. Связь — через событие окна,
 *  чтобы не тащить контекст через полстраницы. */
export function flyToCart(image: string, rect: DOMRect): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<FlyDetail>(EVENT, {
      detail: {
        image,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      },
    }),
  );
}

/** Цель полёта — центр плавающей корзины (data-cart-fab). Если её ещё нет
 *  (первое добавление, FAB монтируется), берём расчётный правый-нижний угол,
 *  где она и появится. */
function cartTarget(): { x: number; y: number } {
  const fab = document.querySelector<HTMLElement>('[data-cart-fab]');
  if (fab) {
    const r = fab.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return { x: window.innerWidth - 68, y: window.innerHeight - 68 };
}

const FLY_SIZE = 72;

export const CartFlyLayer = () => {
  const [items, setItems] = useState<FlyItem[]>([]);

  useEffect(() => {
    const onFly = (event: Event) => {
      const detail = (event as CustomEvent<FlyDetail>).detail;
      setItems((prev) => [...prev, { ...detail, id: counter++ }]);
    };
    window.addEventListener(EVENT, onFly);
    return () => window.removeEventListener(EVENT, onFly);
  }, []);

  const remove = (id: number) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <AnimatePresence>
      {items.map((item) => {
        const startLeft = item.rect.left + item.rect.width / 2 - FLY_SIZE / 2;
        const startTop = item.rect.top + item.rect.height / 2 - FLY_SIZE / 2;
        const target = cartTarget();
        const dx = target.x - (startLeft + FLY_SIZE / 2);
        const dy = target.y - (startTop + FLY_SIZE / 2);

        return (
          <motion.div
            key={item.id}
            className={classes.fly}
            style={{
              left: startLeft,
              top: startTop,
              width: FLY_SIZE,
              height: FLY_SIZE,
              backgroundImage: `url(${item.image})`,
            }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: dx, y: dy, scale: 0.18, opacity: 0.35, rotate: 18 }}
            transition={{
              duration: 0.75,
              // Дуга: по горизонтали тормозит к концу, по вертикали
              // разгоняется — получается естественное «падение» в корзину.
              x: { ease: 'easeOut' },
              y: { ease: 'easeIn' },
              opacity: { duration: 0.75, times: [0, 1], ease: 'easeIn' },
            }}
            onAnimationComplete={() => remove(item.id)}
            aria-hidden
          />
        );
      })}
    </AnimatePresence>
  );
};
