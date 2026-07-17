export const Routes = {
  Home: '/',
  Promotions: '/promotions',
  Catalog: '/#catalog',
  CatalogPage: '/catalog',
  Cart: '/cart',
  About: '/#about',
  Delivery: '/#delivery',
  Faq: '/#faq',
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

/** Адрес страницы товара — ЧПУ /catalog/product/<slug>/.
 *
 *  В отличие от категории, товар пререндерится на сборке под каждый slug
 *  (нужны отдельные заголовок и превью для шеринга — см.
 *  product/[slug]/page.tsx). Свежесть держит вебхук: правка каталога в
 *  админке дёргает пересборку, и страница нового товара появляется через
 *  пару минут. Старый /catalog/product/?slug=… переадресуется сюда. */
export const productRoute = (slug: string) =>
  `${Routes.CatalogPage}/product/${encodeURIComponent(slug)}/`;
