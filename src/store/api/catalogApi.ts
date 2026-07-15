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

/** Бэкенд живёт на отдельном домене (см. api.divodivnoe.com), потому что
 *  сайт — статика на Pages, а Django с админкой на своём сервере. */
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.divodivnoe.com/api/v1/';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
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
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetSiteSettingsQuery,
} = catalogApi;
