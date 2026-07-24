import { Routes } from './routes';

export interface NavItem {
  href: string;
  /** Короткая подпись — для шапки, где пункты делят одну строку. */
  label: string;
  /** Развёрнутая подпись для футера. Если не задана — берётся label. */
  fullLabel?: string;
  /** В футере пункт «Контакты» не нужен: футер сам и есть контакты. */
  inFooter?: boolean;
  /** Пункт, привязанный к блоку, который может отсутствовать. Показываем
   *  его, только когда для блока есть данные (см. useVisibleNavItems).
   *  «faq» — блок «Клиентам»: без вопросов в админке блока на странице нет.
   *  «orders» — «Мои заказы»: виден только у того, кто уже оформлял заказ
   *  на этом устройстве (заказы лежат в localStorage). */
  dynamic?: 'faq' | 'orders';
}

/** Разделы услуг — на десктопе прячутся в дропдаун «Услуги», на мобиле
 *  разворачиваются группой в бургер-меню, в футере идут отдельными ссылками. */
export const ServiceNavItems: NavItem[] = [
  { href: Routes.Subscription, label: 'Подписка' },
  { href: Routes.Wedding, label: 'Свадьба' },
  { href: Routes.Business, label: 'Бизнес' },
];

/** Один источник пунктов меню на шапку и футер. */
export const NavItems: NavItem[] = [
  { href: Routes.Catalog, label: 'Каталог' },
  { href: Routes.Promotions, label: 'Акции' },
  ...ServiceNavItems,
  { href: Routes.About, label: 'О нас' },
  { href: Routes.Delivery, label: 'Доставка', fullLabel: 'Доставка и оплата' },
  { href: Routes.Faq, label: 'Клиентам', dynamic: 'faq' },
  {
    href: Routes.Order,
    label: 'Мои заказы',
    fullLabel: 'Отслеживание заказов',
    dynamic: 'orders',
  },
  { href: Routes.Contacts, label: 'Контакты', inFooter: false },
];

export const FooterNavItems = NavItems.filter(
  ({ inFooter }) => inFooter !== false,
);

/** Структура десктопной шапки: часть пунктов — обычные ссылки, часть
 *  сгруппирована в дропдауны. «Услуги» прячут три раздела, «Контакты» —
 *  телефон, мессенджеры и адрес (см. HeaderNav). Держим отдельно от
 *  плоского NavItems: у шапки своя группировка, у футера — своя. */
export type HeaderEntry =
  | { type: 'link'; item: NavItem }
  | { type: 'group'; label: string; items: NavItem[] }
  | { type: 'contacts'; label: string };

export const HeaderMenu: HeaderEntry[] = [
  { type: 'link', item: { href: Routes.Catalog, label: 'Каталог' } },
  { type: 'link', item: { href: Routes.Promotions, label: 'Акции' } },
  { type: 'group', label: 'Услуги', items: ServiceNavItems },
  { type: 'link', item: { href: Routes.About, label: 'О нас' } },
  { type: 'link', item: { href: Routes.Delivery, label: 'Доставка' } },
  { type: 'link', item: { href: Routes.Faq, label: 'Клиентам', dynamic: 'faq' } },
  {
    type: 'link',
    item: { href: Routes.Order, label: 'Мои заказы', dynamic: 'orders' },
  },
  { type: 'contacts', label: 'Контакты' },
];

/** Правовые документы — отдельным столбцом в футере. */
export const LegalDocs: { href: string; label: string }[] = [
  { href: Routes.Privacy, label: 'Политика обработки данных' },
  { href: Routes.Consent, label: 'Согласие на обработку ПДн' },
  { href: Routes.Offer, label: 'Публичная оферта' },
  { href: Routes.Cookies, label: 'Политика Cookie' },
  { href: Routes.Terms, label: 'Пользовательское соглашение' },
];
