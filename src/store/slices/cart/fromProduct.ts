import type { ProductDto, ProductParameterDto } from '@/store/api/shopApi';

import type { AddToCartPayload, CartOption } from './types';

/** Выбор по умолчанию: первый вариант каждого параметра.
 *
 *  Первый — потому что порядок задаёт админка, и там в подсказке написано
 *  ставить первым бесплатный вариант. Так цена на кнопке совпадает с
 *  ценой на карточке товара, а покупатель не получает молча вариант
 *  подороже. Параметры без вариантов бэкенд не отдаёт, но пустой список
 *  на всякий случай отбрасываем и здесь — иначе `values[0]` был бы undefined. */
export const defaultOptions = (
  parameters: ProductParameterDto[],
): CartOption[] =>
  parameters
    .filter((parameter) => parameter.values.length > 0)
    .map((parameter) => toOption(parameter, parameter.values[0].id));

/** Вариант параметра как строка выбора. Нет такого id — берём первый:
 *  вариант удалили в админке, пока страница висела открытой. */
export const toOption = (
  parameter: ProductParameterDto,
  valueId: number,
): CartOption => {
  const value =
    parameter.values.find((v) => v.id === valueId) ?? parameter.values[0];
  return {
    name: parameter.name,
    valueId: value.id,
    value: value.value,
    priceDelta: value.price_delta,
  };
};

/** Выбор, лежащий в корзине, — в термины параметров этого товара.
 *
 *  Строка корзины помнит только id вариантов (и переживает перезагрузку
 *  и чужую ссылку), а странице товара нужно знать, какая кнопка в какой
 *  группе нажата. Вариант, которого больше нет (удалили в админке),
 *  заменяем первым — иначе группа осталась бы без выбора вовсе. */
export const reconcileOptions = (
  parameters: ProductParameterDto[],
  options: CartOption[],
): CartOption[] => {
  const chosen = new Set(options.map((option) => option.valueId));
  return parameters
    .filter((parameter) => parameter.values.length > 0)
    .map((parameter) =>
      toOption(
        parameter,
        parameter.values.find((value) => chosen.has(value.id))?.id ??
          parameter.values[0].id,
      ),
    );
};

/** Выбор после клика по варианту: у этого параметра — новый, у остальных
 *  прежний. Старый вариант того же параметра выбрасываем по его значениям,
 *  а не по индексу: параметры и их порядок задаёт админка. */
export const chooseOption = (
  parameters: ProductParameterDto[],
  options: CartOption[],
  parameterId: number,
  valueId: number,
): CartOption[] => {
  const parameter = parameters.find((p) => p.id === parameterId);
  if (!parameter) return options;
  const others = options.filter(
    (option) => !parameter.values.some((value) => value.id === option.valueId),
  );
  return reconcileOptions(parameters, [
    ...others,
    toOption(parameter, valueId),
  ]);
};

/** Сумма прибавок за выбранные варианты. */
export const optionsTotal = (options: CartOption[]): number =>
  options.reduce((sum, option) => sum + option.priceDelta, 0);

/** Цена штуки с учётом выбранных параметров — то, что видно на кнопке
 *  и что уедет в строку корзины. Сервер посчитает так же (pricing.py). */
export const unitPrice = (product: ProductDto, options: CartOption[]): number =>
  product.price + optionsTotal(options);

/** Товар с витрины → строка корзины. Без явного выбора берём умолчания:
 *  так товар можно класть в корзину и оттуда, где параметры не показаны
 *  (блок «Рекомендуем к заказу»). */
export const toCartLine = (
  product: ProductDto,
  options: CartOption[] = defaultOptions(product.parameters),
): AddToCartPayload => ({
  productId: product.id,
  slug: product.slug,
  name: product.name,
  price: unitPrice(product, options),
  image: product.image,
  categoryId: product.category,
  options,
});
