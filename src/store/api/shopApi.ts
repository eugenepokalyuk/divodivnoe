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
  image: string | null;
  price: number;
}

export interface CategoryDetailDto extends CategoryDto {
  products: ProductDto[];
}

export interface SiteSettingsDto {
  /** Фото первого экрана из админки. null — показываем вшитое в вёрстку. */
  hero_image: string | null;
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
 *  статика на Pages, а Django с админкой на своём сервере. */
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.divodivnoe.com/api/v1/';

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getCategories: build.query<CategoryDto[], void>({
      query: () => 'catalog/categories/',
    }),
    getCategory: build.query<CategoryDetailDto, string>({
      query: (slug) => `catalog/categories/${slug}/`,
    }),
    getSiteSettings: build.query<SiteSettingsDto, void>({
      query: () => 'catalog/site/',
    }),
    getPromotions: build.query<Promotion[], void>({
      query: () => 'promotions/',
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetSiteSettingsQuery,
  useGetPromotionsQuery,
} = shopApi;
