/** Мессенджеры, в которые пишут клиенты. */
export enum Messenger {
  Telegram = 'telegram',
  Max = 'max',
}

/** Телеграм-аккаунты. Значение — username без «@».
 *  Заглушка: подставить реальный аккаунт магазина здесь — и он разъедется
 *  по всем акциям и кнопкам «Написать» разом. */
export enum TelegramContact {
  Manager = 'wazzupjohnny',
}

/** Аккаунты в MAX. Значение — часть ссылки после max.ru/.
 *  Бизнес-аккаунт «Диво Дивное Цветочная лавка». */
export enum MaxContact {
  Shop = 'id143305867962_biz',
}

export enum PhoneContact {
  Manager = '+79999999999',
}

export const CompanyName = 'Диво Дивное';
export const CompanyDomain = 'divodivnoe.com';
export const CompanyEmail = 'hello@divodivnoe.com';

export const Contacts = {
  Telegram: `https://t.me/${TelegramContact.Manager}`,
  Max: `https://max.ru/${MaxContact.Shop}`,
  Phone: `tel:${PhoneContact.Manager}`,
  Email: `mailto:${CompanyEmail}`,
};

export const MessengerLabel: Record<Messenger, string> = {
  [Messenger.Telegram]: 'Telegram',
  [Messenger.Max]: 'MAX',
};

export const MessengerLink: Record<Messenger, string> = {
  [Messenger.Telegram]: Contacts.Telegram,
  [Messenger.Max]: Contacts.Max,
};

/** Как показываем телефон в вёрстке (значение enum — в формате для tel:). */
export const PhoneDisplay = '+7 999 999-99-99';
