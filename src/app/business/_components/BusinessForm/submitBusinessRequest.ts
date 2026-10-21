import type { ContactMethod } from '@/app/cart/_components/OrderForm/orderSchema';
import { Goals, reachGoal } from '@/lib/analytics/metrika';
import { apiBaseUrl } from '@/store/api/shopApi';

interface SubmitInput {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  contactMethod: ContactMethod;
  task?: string;
}

/** Отправляет заявку со страницы «Для бизнеса» (POST /business-requests/).
 *
 *  Бэкенд сохраняет её в админку («Заявки для бизнеса») и пересылает
 *  флористу в Telegram. Бросает с человекочитаемым текстом при ошибке —
 *  его показывает форма. */
export async function submitBusinessRequest(input: SubmitInput): Promise<void> {
  const body = JSON.stringify({
    first_name: input.firstName,
    last_name: input.lastName,
    company: input.company,
    phone: input.phone,
    contact_method: input.contactMethod,
    task: input.task ?? '',
  });

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}business-requests/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch {
    throw new Error(
      'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.',
    );
  }

  if (!res.ok) {
    let message = 'Не удалось отправить заявку. Попробуйте ещё раз.';
    try {
      const data = await res.json();
      const first = Object.values(data)[0];
      if (Array.isArray(first) && typeof first[0] === 'string')
        message = first[0];
      else if (typeof first === 'string') message = first;
    } catch {
      // тело не JSON — оставляем общий текст
    }
    throw new Error(message);
  }

  reachGoal(Goals.BusinessLead);
}
