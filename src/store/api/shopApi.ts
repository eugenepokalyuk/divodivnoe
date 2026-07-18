import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/** Категория в том виде, в каком её отдаёт Django. Поля в snake_case —
 *  это чужой контракт, переименовывать его на нашей стороне не будем,
 *  иначе при расхождении не найти концов. */
export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  /** Абсолютная ссылка на фото. null, если в админке не загружено. */
  image: string | null;
  price_from: number;
  note: string;
}

/** Вариант ответа на параметр: «Большой», «Бутоньерка не нужна».
 *  price_delta — прибавка к цене товара в рублях, 0 — вариант бесплатный. */
export interface ProductParameterValueDto {
  id: number;
  value: string;
  price_delta: number;
  /** Индекс фото в `images` (0-based), на которое листать галерею при
   *  выборе этого варианта. null — фото не привязано. */
  image_index: number | null;
}

/** Параметр товара: вопрос и варианты ответа. Выбрать можно ровно один
 *  вариант; по умолчанию выбран первый (порядок задан в админке). */
export interface ProductParameterDto {
  id: number;
  name: string;
  /** Показывать ли прибавку к цене на кнопках вариантов. */
  show_price: boolean;
  values: ProductParameterValueDto[];
}

export interface ProductDto {
  id: number;
  name: string;
  slug: string;
  description: string;
  /** Обложка — первое фото. null, если в админке не загружено. */
  image: string | null;
  price: number;
  /** Вся галерея абсолютными ссылками, обложка первой. Бэкенд уже
   *  склеил обложку с доп. фото и отсортировал — на клиенте просто
   *  скармливаем массив слайдеру. Пустой, если фото нет вовсе. */
  images: string[];
  /** id категории — по нему видно, что товар из «подарочной» категории. */
  category: number;
  /** Пустой массив — у товара нечего выбирать, блок не рисуется. */
  parameters: ProductParameterDto[];
}

/** Условия подарка к букету. Витрина показывает подарок сама, без похода
 *  на сервер на каждый клик; при оформлении сервер всё равно пересчитает. */
export interface GiftRuleDto {
  /** Цена одного букета, с которой начинается подарок. */
  threshold: number;
  /** Категории, товары которых считаются букетом. */
  category_ids: number[];
  product: ProductDto;
}

export interface CategoryDetailDto extends CategoryDto {
  products: ProductDto[];
}

/** Акция на витрине.
 *
 *  Ключ — code, а не id: он уникален, читается в отладке и это ровно тот
 *  код, что клиент называет флористу и что стоит в deep-link бота. */
export interface Promotion {
  code: string;
  title: string;
  description: string;
  /** Крупная плашка на карточке: «500 ₽», «10%». */
  badge: string;
  /** Условия мелким шрифтом. Пустая строка — блок не рендерится. */
  terms: string;
}

/** Вопрос-ответ для блока «Клиентам» на главной. Заводится в админке;
 *  пустой список — блока и пункта меню на сайте нет. */
export interface FaqDto {
  id: number;
  question: string;
  answer: string;
}

/** Отзыв клиента для слайдера на главной.
 *
 *  Поля в snake_case — контракт Django, не переименовываем (см. выше). */
export interface ReviewDto {
  id: number;
  author_name: string;
  /** Абсолютная ссылка на аватар. null — фото не загружено, рисуем заглушку. */
  avatar: string | null;
  text: string;
  /** Оценка автора, 1–5. */
  rating: number;
}

/** Один шаг ленты статуса заказа. */
export interface OrderStatusStep {
  status: 'new' | 'in_progress' | 'done' | 'cancelled';
  label: string;
  at: string;
}

/** Статус заказа для страницы отслеживания. Приходит по токену-ссылке,
 *  без логина; чувствительного (телефон, состав) здесь намеренно нет. */
export interface OrderStatusDto {
  number: number;
  status: 'new' | 'in_progress' | 'done' | 'cancelled';
  status_display: string;
  total: number;
  created_at: string;
  timeline: OrderStatusStep[];
}

/** Бэкенд живёт на отдельном домене (api.divodivnoe.com), потому что сайт —
 *  статика на Pages, а Django с админкой на своём сервере.
 *
 *  Экспортируем: корзина синхронизируется тем же fetch мимо RTK Query
 *  (императивные POST/PUT в listener-middleware), и base URL у неё общий. */
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.divodivnoe.com/api/v1/';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (build) => ({
    getCategories: build.query<CategoryDto[], void>({
      query: () => 'catalog/categories/',
    }),
    getCategory: build.query<CategoryDetailDto, string>({
      query: (slug) => `catalog/categories/${slug}/`,
    }),
    getProduct: build.query<ProductDto, string>({
      query: (slug) => `catalog/products/${slug}/`,
    }),
    getRecommended: build.query<ProductDto[], void>({
      query: () => 'catalog/products/recommended/',
    }),
    /** Подарок к букету. Бэкенд отдаёт 204, если акции нет, — RTK Query
     *  превращает пустое тело в undefined, и блок просто не рисуется. */
    getGiftRule: build.query<GiftRuleDto | undefined, void>({
      query: () => 'gift-rule/',
    }),
    /** Статус заказа по токену из ссылки «отслеживать заказ». */
    getOrderStatus: build.query<OrderStatusDto, string>({
      query: (token) => `orders/${token}/status/`,
    }),
    getPromotions: build.query<Promotion[], void>({
      query: () => 'promotions/',
    }),
    getFaqs: build.query<FaqDto[], void>({
      query: () => 'faqs/',
    }),
    getReviews: build.query<ReviewDto[], void>({
      query: () => 'reviews/',
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetProductQuery,
  useGetRecommendedQuery,
  useGetGiftRuleQuery,
  useGetOrderStatusQuery,
  useGetPromotionsQuery,
  useGetFaqsQuery,
  useGetReviewsQuery,
} = shopApi;
