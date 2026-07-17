import React from 'react';
import type { Metadata } from 'next';

import { CompanyName } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import { ProductView } from '../_components/ProductView/ProductView';
import { fetchAllProducts, fetchProduct } from './fetchProduct';

interface Params {
  params: Promise<{ slug: string }>;
}

/** Какие страницы товара печатать на сборке. Статический экспорт не умеет
 *  досоздавать неизвестные пути в рантайме, поэтому список исчерпывающий —
 *  все активные товары каталога. Новый товар из админки дёргает пересборку
 *  (вебхук), и его страница появляется в следующие ~2–3 минуты. */
export async function generateStaticParams() {
  const products = await fetchAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

// Неизвестный slug — жёсткий 404, а не попытка отрендерить на лету
// (в экспорте её всё равно нет).
export const dynamicParams = false;

/** Заголовок, описание и превью-картинка для шеринга — на каждый товар свои.
 *  Ради этого страница и стала пререндеренной: у ссылки на конкретный букет
 *  в мессенджере/соцсети появляется нормальная карточка. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return { title: 'Товар' };
  }

  const description = product.description
    ? `${product.description} — ${formatPrice(product.price)}.`
    : `${product.name} — ${formatPrice(product.price)}. Авторская работа цветочной мастерской «${CompanyName}».`;

  const canonical = `/catalog/product/${slug}/`;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${product.name} — ${formatPrice(product.price)}`,
      description,
      url: canonical,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}
