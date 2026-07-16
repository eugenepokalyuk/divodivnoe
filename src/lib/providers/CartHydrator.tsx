'use client';

import { useEffect } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { hydrate, loadPersistedCart } from '@/store/slices/cart';

/** Поднимает корзину из localStorage в стор при первой отрисовке.
 *
 *  Отдельным компонентом, а не в AppProviders напрямую: localStorage есть
 *  только в браузере, а провайдеры рендерятся и на сборке (сайт — статика).
 *  useEffect гарантирует, что чтение произойдёт уже на клиенте. Ничего не
 *  рисует. */
export const CartHydrator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate(loadPersistedCart()));
  }, [dispatch]);

  return null;
};
