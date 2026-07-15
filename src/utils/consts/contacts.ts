/** Мессенджеры, в которые пишут клиенты. */
export enum Messenger {
  Telegram = 'telegram',
  Whatsapp = 'whatsapp',
  Max = 'max',
}

/** Телеграм-контакт магазина. Меняется только здесь — разъедется по всем
 *  акциям и кнопкам «Написать» разом.
 *
 *  Принимает оба формата, и в обоих работает предзаполнение текста
 *  (https://core.telegram.org/api/links):
 *  - `'divo_divnoe_nsk'` — username без «@» → `t.me/<username>?text=`
 *  - `'+79231068626'` — телефон с «+» → `t.me/+<номер>?text=`
 *
 *  Ссылка собирается конкатенацией, поэтому достаточно вписать нужное
 *  значение — код трогать не нужно. */
export enum TelegramContact {
  Manager = 'divo_divnoe_nsk',
}

/** Номер для wa.me — только цифры, без «+» и разделителей. */
export enum WhatsappContact {
  Shop = '79231068626',
}

/** Сообщество ВКонтакте. */
export enum VkContact {
  Shop = 'viva_flo',
}

/** Аккаунт в Instagram. Значение — часть ссылки после instagram.com/. */
export enum InstagramContact {
  Shop = 'divo.divnoe.nsk',
}

/** Аккаунты в MAX. Значение — часть ссылки после max.ru/.
 *  Бизнес-аккаунт «Диво Дивное Цветочная лавка». */
export enum MaxContact {
  Shop = 'id143305867962_biz',
}

export enum PhoneContact {
  Manager = '+79231068626',
}

export const CompanyName = 'Диво Дивное';
export const CompanyDomain = 'divodivnoe.com';
export const CompanyEmail = 'vivaflowers54@gmail.com';

/** Данные с карточки 2ГИС — единственный источник правды по адресу и часам,
 *  чтобы они не разъезжались между футером и секцией доставки. */
export const CompanyCity = 'Новосибирск';
export const CompanyAddress = 'Проспект Дзержинского, 3, 1 этаж';
export const CompanyAddressFull = `${CompanyAddress}, Дзержинский район, ${CompanyCity}`;
export const WorkingHours = 'Ежедневно с 9:00 до 21:00';
export const Company2gis =
  'https://2gis.ru/novosibirsk/geo/70000001097869773';

export const Contacts = {
  Telegram: `https://t.me/${TelegramContact.Manager}`,
  Whatsapp: `https://wa.me/${WhatsappContact.Shop}`,
  Max: `https://max.ru/${MaxContact.Shop}`,
  Vk: `https://vk.com/${VkContact.Shop}`,
  Instagram: `https://www.instagram.com/${InstagramContact.Shop}/`,
  Phone: `tel:${PhoneContact.Manager}`,
  Email: `mailto:${CompanyEmail}`,
  Map: Company2gis,
};

interface MessengerConfig {
  label: string;
  link: string;
  /** Умеет ли ссылка открыть чат с уже набранным текстом.
   *  Telegram — draft link ?text=, WhatsApp — wa.me/<номер>?text=.
   *  У MAX аналога нет (см. utils/helpers/messengers.ts), поэтому там
   *  клиент называет промокод сам. */
  supportsPrefill: boolean;
  /** Контакт ещё не боевой — держим на виду, чтобы не забыть заменить. */
  isPlaceholder: boolean;
}

export const Messengers: Record<Messenger, MessengerConfig> = {
  [Messenger.Telegram]: {
    label: 'Telegram',
    link: Contacts.Telegram,
    supportsPrefill: true,
    isPlaceholder: false,
  },
  [Messenger.Whatsapp]: {
    label: 'WhatsApp',
    link: Contacts.Whatsapp,
    supportsPrefill: true,
    isPlaceholder: false,
  },
  [Messenger.Max]: {
    label: 'MAX',
    link: Contacts.Max,
    supportsPrefill: false,
    isPlaceholder: false,
  },
};

/** Порядок кнопок везде одинаковый — так пользователь запоминает раскладку. */
export const MessengerOrder: Messenger[] = [
  Messenger.Telegram,
  Messenger.Whatsapp,
  Messenger.Max,
];

/** Как показываем телефон в вёрстке (значение enum — в формате для tel:). */
export const PhoneDisplay = '+7 923 106-86-26';
