import { Cormorant_Garamond, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import clsx from 'clsx';

const interSans = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const cormorantSerif = Cormorant_Garamond({
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

// Фирменный шрифт логотипа (TYGRA, 2004; см. src/fonts/COPYRIGHT.txt).
// Акцидентный старославянский — только для логотипа, не для текста.
// Исходный ttf сконвертирован в woff2: 102 КБ → 18 КБ.
const yauzaTygra = localFont({
  src: '../../fonts/yauzatygra.woff2',
  variable: '--font-yauza',
  display: 'swap',
  // Логотип не должен «прыгать» при подгрузке — Cormorant ближе всего
  // по общей серифной фактуре.
  fallback: ['Cormorant Garamond', 'serif'],
});

export function getFonts() {
  return clsx(
    interSans.variable,
    cormorantSerif.variable,
    yauzaTygra.variable,
  );
}
