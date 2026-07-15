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
  images: { unoptimized: true },
};

export default nextConfig;
