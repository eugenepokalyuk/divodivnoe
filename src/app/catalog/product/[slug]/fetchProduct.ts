import type { ProductDto } from '@/store/api/shopApi';
import { apiBaseUrl } from '@/store/api/shopApi';

/** Список товаров для пререндера — тянется на сборке (generateStaticParams).
 *
 *  Падаем, если каталог не отдался: лучше уронить сборку и оставить в
 *  проде прошлую рабочую версию, чем выкатить сайт вовсе без страниц
 *  товара. Пересборку каждый раз дёргает вебхук из админки при изменении
 *  каталога (см. catalog/redeploy.py на бэкенде), так что список свежий. */
export async function fetchAllProducts(): Promise<ProductDto[]> {
  const res = await fetch(`${apiBaseUrl}catalog/products/`);
  if (!res.ok) {
    throw new Error(`Каталог не отдался на сборке: HTTP ${res.status}`);
  }
  return res.json();
}

/** Один товар для метаданных страницы (generateMetadata). null — товара
 *  нет (скрыли/удалили между сборкой и запросом): страница отрендерится
 *  с дефолтным заголовком, живые данные подтянет клиент. */
export async function fetchProduct(slug: string): Promise<ProductDto | null> {
  try {
    const res = await fetch(`${apiBaseUrl}catalog/products/${slug}/`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
