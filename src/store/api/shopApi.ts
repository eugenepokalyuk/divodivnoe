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
    getPromotions: build.query<Promotion[], void>({
      query: () => 'promotions/',
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetProductQuery,
  useGetPromotionsQuery,
} = shopApi;
