import { Goals, reachGoal } from '@/lib/analytics/metrika';
import { apiBaseUrl } from '@/store/api/shopApi';

interface SubmitInput {
  phone: string;
  comment?: string;
}

/** Отправляет заявку обратной связи (POST /feedback/).
 *
 *  Сайт — статический экспорт, токен телеграм-бота в браузер выносить нельзя,
 *  поэтому шлём на бэкенд, а он пересылает в Telegram (как /gift-hints/ и
 *  /orders/). От бэкенда нужен эндпоинт feedback/, который на такой POST
 *  отправляет в чат флориста «Обратная связь, пожалуйста свяжитесь» вместе с
 *  телефоном и комментарием.
 *
 *  Бросает с человекочитаемым текстом при ошибке — его показывает форма. */
export async function submitFeedback(input: SubmitInput): Promise<void> {
  const body = JSON.stringify({
    phone: input.phone,
    comment: input.comment ?? '',
  });

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}feedback/`, {
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

  reachGoal(Goals.Feedback);
}
