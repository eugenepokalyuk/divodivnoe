import { TelegramContact } from '@/utils/consts';

export enum PromotionId {
  FirstOrder = 'first-order',
  WeddingBouquet = 'wedding-bouquet',
}

export interface Promotion {
  id: PromotionId;
  /** Заголовок акции — он же попадает в текст сообщения в телеграм. */
  title: string;
  description: string;
  /** Крупная плашка на карточке: «500 ₽», «10%». */
  badge: string;
  /** Промокод. Нужен для MAX: там ссылка не умеет подставлять текст
   *  в чат, поэтому клиент называет код сам, а флорист понимает, откуда он. */
  code: string;
  /** Условия мелким шрифтом. Пустая строка — блок не рендерится. */
  terms?: string;
  /** В какой телеграм-аккаунт ведёт акция. */
  contact: TelegramContact;
}

export interface PromotionsState {
  items: Promotion[];
}
