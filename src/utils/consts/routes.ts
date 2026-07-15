export const Routes = {
  Home: '/',
  Promotions: '/promotions',
  Catalog: '/#catalog',
  CatalogPage: '/catalog',
  About: '/#about',
  Delivery: '/#delivery',
  Contacts: '/#contacts',
};

/** Адрес страницы категории.
 *
 *  Параметром, а не путём вида /catalog/piony. Сайт — статический
 *  экспорт: под каждый путь на сборке печатается отдельный файл.
 *  Категория, заведённая в админке позже, файла бы не имела — и клик
 *  по карточке с главной вёл бы в 404, пока сайт не пересоберут.
 *  С параметром файл один и работает для любой категории сразу. */
export const categoryRoute = (slug: string) =>
  `${Routes.CatalogPage}/?category=${encodeURIComponent(slug)}`;
