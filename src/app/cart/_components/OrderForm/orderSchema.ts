import { z } from 'zod';

import { isCompleteRuPhone } from '@/utils/helpers';

/** Способы связи — значения совпадают с Order.Contact на бэкенде. */
export const CONTACT_METHODS = [
  'phone',
  'max',
  'telegram',
  'whatsapp',
] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const CONTACT_LABELS: Record<ContactMethod, string> = {
  phone: 'Позвонить по телефону',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  max: 'MAX',
};

/** Порядок кнопок способа связи в форме. */
export const CONTACT_ORDER: ContactMethod[] = [
  'phone',
  'telegram',
  'whatsapp',
  'max',
];

export const orderSchema = z.object({
  firstName: z.string().trim().min(1, 'Укажите имя'),
  lastName: z.string().trim().min(1, 'Укажите фамилию'),
  phone: z
    .string()
    .refine(isCompleteRuPhone, 'Введите номер телефона полностью'),
  // contactMethod хранится как строка ('' — ничего не выбрано); refine
  // и требует выбор, и сужает тип до ContactMethod.
  contactMethod: z
    .string()
    .refine(
      (v): v is ContactMethod => CONTACT_METHODS.includes(v as ContactMethod),
      'Выберите, как с вами удобно связаться',
    ),
  comment: z
    .string()
    .trim()
    .max(1000, 'Слишком длинный комментарий')
    .optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;
