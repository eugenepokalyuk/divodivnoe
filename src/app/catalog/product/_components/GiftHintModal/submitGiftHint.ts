import { apiBaseUrl } from '@/store/api/shopApi';

interface SubmitInput {
  senderName: string;
  recipientName: string;
  phone: string;
  productId: number;
}

/** Отправляет заявку «Намекнуть о подарке» (POST /gift-hints/).
 *  Бросает с человекочитаемым текстом при ошибке — его показывает форма. */
export async function submitGiftHint(input: SubmitInput): Promise<void> {
  const body = JSON.stringify({
    sender_name: input.senderName,
    recipient_name: input.recipientName,
    phone: input.phone,
    product: input.productId,
  });

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}gift-hints/`, {
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
}
