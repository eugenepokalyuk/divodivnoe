import type { NextConfig } from 'next';

// GitHub Pages раздаёт статику, поэтому собираем экспорт в out/.
// На project-сайте (eugenepokalyuk.github.io/divodivnoe) все ссылки должны
// быть с префиксом /divodivnoe — его задаёт workflow через NEXT_PUBLIC_BASE_PATH.
// Когда прикрутим divodivnoe.com, переменную убираем — префикс не нужен.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath,
  // Без слеша на конце Pages отдаёт 404 на /promotions: он ищет promotions.html,
  // а экспорт кладёт promotions/index.html.
  trailingSlash: true,
  images: {
    // На Pages оптимизатора нет — картинки уезжают как есть. Фото из админки
    // жмёт сам Django на загрузке (см. catalog/images.py в divo_bot).
    unoptimized: true,
    // Фото каталога и товаров лежат на бэкенде. Без этого списка next/image
    // отказывается грузить чужой домен — проверка работает и при
    // выключенной оптимизации.
    remotePatterns: [
      { protocol: 'https', hostname: 'api.divodivnoe.com', pathname: '/media/**' },
      // Локальная разработка против Django на localhost:8000 — иначе
      // next/image отвергает фото и аватары с дев-бэкенда.
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
