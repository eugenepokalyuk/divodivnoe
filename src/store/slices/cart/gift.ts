import type { GiftRuleDto } from '@/store/api/shopApi';

import type { CartLine } from './types';

/** Есть ли в корзине букет, за который положен подарок.
 *
 *  Повторяет правило сервера (orders/pricing.py, gift_for): порог
 *  сравнивается с ценой одной штуки (уже с параметрами), а не с суммой
 *  корзины, и считаются только товары «подарочных» категорий. Здесь это
 *  ради витрины — показать подарок сразу, не спрашивая сервер на каждый
 *  клик по «+». Решает всё равно сервер при оформлении: подарок в заказ
 *  кладёт он, из браузера его не выпросить. */
export const isGiftEarned = (
  lines: CartLine[],
  rule: GiftRuleDto | undefined,
): boolean => {
  if (!rule) return false;
  return lines.some(
    (line) =>
      line.price >= rule.threshold &&
      rule.category_ids.includes(line.categoryId),
  );
};

/** Сколько не хватает до подарка — для подсказки «добавьте ещё на N ₽».
 *
 *  Считаем от самого дорогого букета подходящей категории: подарок даёт
 *  одна позиция, а не сумма, поэтому «добрать» можно только выбрав букет
 *  дороже. null — в корзине вообще нет букетов (советовать нечего) или
 *  подарок уже заработан. */
export const giftGap = (
  lines: CartLine[],
  rule: GiftRuleDto | undefined,
): number | null => {
  if (!rule || isGiftEarned(lines, rule)) return null;
  const prices = lines
    .filter((line) => rule.category_ids.includes(line.categoryId))
    .map((line) => line.price);
  if (prices.length === 0) return null;
  return rule.threshold - Math.max(...prices);
};
