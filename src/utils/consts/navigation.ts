import { Routes } from './routes';

export interface NavItem {
  href: string;
  /** Короткая подпись — для шапки, где пункты делят одну строку. */
  label: string;
  /** Развёрнутая подпись для футера. Если не задана — берётся label. */
  fullLabel?: string;
  /** В футере пункт «Контакты» не нужен: футер сам и есть контакты. */
  inFooter?: boolean;
}

/** Один источник пунктов меню на шапку и футер. */
export const NavItems: NavItem[] = [
  { href: Routes.Catalog, label: 'Каталог' },
  { href: Routes.Promotions, label: 'Акции' },
  { href: Routes.About, label: 'О нас' },
  { href: Routes.Delivery, label: 'Доставка', fullLabel: 'Доставка и оплата' },
  { href: Routes.Contacts, label: 'Контакты', inFooter: false },
];

export const FooterNavItems = NavItems.filter(
  ({ inFooter }) => inFooter !== false,
);
