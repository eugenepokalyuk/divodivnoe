import type { Promotion } from '@/store/slices/promotions';
import { CompanyDomain, TelegramContact } from '@/utils/consts';

/** Ссылка на чат с заранее набранным текстом (Telegram message draft link):
 *  https://t.me/<username>?text=<текст> — открывает чат и кладёт текст
 *  в поле ввода, отправляет его пользователь сам.
 *
 *  У MAX аналога нет: документированы только ?start= для ботов и :share?text=,
 *  который открывает выбор получателя, а не чат магазина. Поэтому в MAX ведёт
 *  обычная ссылка (Contacts.Max), а акцию клиент называет промокодом. */
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

export function buildPromotionTelegramLink(promotion: Promotion): string {
  return buildTelegramLink(promotion.contact, buildPromotionMessage(promotion));
}
