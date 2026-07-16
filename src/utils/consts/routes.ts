export const Routes = {
  Home: '/',
  Promotions: '/promotions',
  Catalog: '/#catalog',
  CatalogPage: '/catalog',
  Cart: '/cart',
  About: '/#about',
  Delivery: '/#delivery',
  Contacts: '/#contacts',
  // Правовые документы (152-ФЗ и оферта) — обязательны, раз сайт собирает
  // персональные данные (имя, телефон, заказы).
  Privacy: '/privacy',
  Consent: '/consent',
  Offer: '/offer',
  Cookies: '/cookies',
  Terms: '/terms',
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

/** Адрес страницы товара.
 *
 *  Тем же параметром, что и категория (см. выше): статический экспорт
 *  печатает один файл /catalog/product/, а slug приходит query-строкой —
 *  товар, заведённый в админке позже, работает без пересборки сайта. */
export const productRoute = (slug: string) =>
  `${Routes.CatalogPage}/product/?slug=${encodeURIComponent(slug)}`;
