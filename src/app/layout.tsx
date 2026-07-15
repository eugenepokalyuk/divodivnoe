import React from 'react';
import type { Metadata } from 'next';
import 'normalize.css';

import { Layout } from '@/components/units';
import { getFonts } from '@/lib/helpers';
import { AppProviders } from '@/lib/providers';
import { CompanyName } from '@/utils/consts';

import '../styles/globals.scss';

const description =
  'Авторские букеты и цветочные композиции с доставкой. Свежие цветы каждый день, сборка за час, доставка по городу.';

// На project-сайте GitHub Pages всё живёт в /divodivnoe. Пути в metadata
// Next не префиксует сам (в отличие от Link и импортов), поэтому подставляем
// вручную — иначе фавикон отдаёт 404.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://divodivnoe.com',
  ),
  title: {
    default: `${CompanyName} — авторские букеты с доставкой`,
    template: `${CompanyName} | %s`,
  },
  description,
  applicationName: CompanyName,
  keywords: [
    'цветы',
    'букеты',
    'доставка цветов',
    'свадебный букет',
    'флористика',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: CompanyName,
    title: `${CompanyName} — авторские букеты с доставкой`,
    description,
  },
  icons: {
    icon: [{ url: `${basePath}/favicon.svg`, type: 'image/svg+xml' }],
    shortcut: `${basePath}/favicon.svg`,
  },
};

type Props = Readonly<React.PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ru">
      <body className={getFonts()}>
        <AppProviders>
          <Layout>{children}</Layout>
        </AppProviders>
      </body>
    </html>
  );
}
