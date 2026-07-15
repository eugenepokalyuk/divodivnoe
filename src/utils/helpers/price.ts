/** Цена в рублях без копеек: 3500 → «3 500 ₽».
 *
 *  Разряды разделяются неразрывным пробелом (его и ставит Intl), поэтому
 *  число не разорвётся переносом строки посреди суммы. */
export function formatPrice(rubles: number): string {
  return `${rubles.toLocaleString('ru-RU')} ₽`;
}

/** «от 3 500 ₽» — цена коллекции на карточке каталога. */
export function formatPriceFrom(rubles: number): string {
  return `от ${formatPrice(rubles)}`;
}
