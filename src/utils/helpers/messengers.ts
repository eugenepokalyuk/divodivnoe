import type { Promotion } from '@/store/slices/promotions';
import {
  CompanyDomain,
  Messenger,
  Messengers,
  TelegramContact,
} from '@/utils/consts';

/** Ссылка в чат с заранее набранным текстом.
 *
 *  Telegram — message draft link: https://t.me/<username>?text=<текст>
 *  WhatsApp — https://wa.me/<номер>?text=<текст>
 *  Оба кладут текст в поле ввода; отправляет его сам пользователь.
 *
 *  MAX так не умеет: документированы только ?start= для ботов и :share?text=,
 *  который открывает выбор получателя, а не чат магазина. Наш аккаунт —
 *  бизнес-профиль, не бот, поэтому там ссылка просто открывает чат,
 *  а акцию клиент называет промокодом. */
export function buildMessengerLink(
  messenger: Messenger,
  text?: string,
): string {
  const { link, supportsPrefill } = Messengers[messenger];

  if (!text || !supportsPrefill) return link;

  return `${link}?text=${encodeURIComponent(text)}`;
}

/** Прямая ссылка в телеграм по username — на случай, если у акции
 *  свой менеджер, отличный от общего контакта магазина. */
export function buildTelegramLink(
  contact: TelegramContact,
  text?: string,
): string {
  const base = `https://t.me/${contact}`;

  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function buildPromotionMessage(promotion: Promotion): string {
  return `Привет! Я с сайта ${CompanyDomain}, хочу воспользоваться акцией «${promotion.title}» (промокод ${promotion.code})`;
}

export function buildPromotionLink(
  promotion: Promotion,
  messenger: Messenger,
): string {
  // У телеграма акция может вести к конкретному менеджеру.
  if (messenger === Messenger.Telegram) {
    return buildTelegramLink(promotion.contact, buildPromotionMessage(promotion));
  }

  return buildMessengerLink(messenger, buildPromotionMessage(promotion));
}
