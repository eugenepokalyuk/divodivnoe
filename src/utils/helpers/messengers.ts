import type { Promotion } from '@/store/api/shopApi';
import { CompanyDomain, Messenger, Messengers } from '@/utils/consts';

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

/** Текст, который уедет флористу. Код тот же, что в админке и в ссылке
 *  бота, — флорист найдёт акцию по нему сразу. */
export function buildPromotionMessage(promotion: Promotion): string {
  return `Привет! Я с сайта ${CompanyDomain}, хочу воспользоваться акцией «${promotion.title}» (промокод ${promotion.code})`;
}

export function buildPromotionLink(
  promotion: Promotion,
  messenger: Messenger,
): string {
  return buildMessengerLink(messenger, buildPromotionMessage(promotion));
}
