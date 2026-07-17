import { apiBaseUrl } from '@/store/api/shopApi';

/** Уже отправленные ошибки — чтобы один и тот же краш в цикле рендера не
 *  завалил бэкенд сотней одинаковых репортов. Живёт на время сессии. */
const alreadySent = new Set<string>();

interface ClientError {
  message: string;
  stack?: string;
  url?: string;
}

/** Шлёт ошибку фронта на бэкенд (POST /client-errors/), тот пересылает
 *  флористу в телеграм. Fire-and-forget: репорт об ошибке сам не имеет
 *  права ни упасть, ни задержать страницу, ни зациклиться.
 *
 *  Сайт — статика на Pages, серверных логов у фронта нет; без этого краш
 *  в браузере видно только по жалобе. */
export function reportClientError(error: ClientError): void {
  if (typeof window === 'undefined') return;

  const message = (error.message || 'Unknown error').slice(0, 500);
  const stack = (error.stack ?? '').slice(0, 2000);

  // Дедуп по тексту+началу стека: повторы того же краша не шлём.
  const key = `${message}|${stack.slice(0, 200)}`;
  if (alreadySent.has(key)) return;
  alreadySent.add(key);

  try {
    const body = JSON.stringify({
      message,
      stack,
      url: error.url || window.location.href,
      user_agent: navigator.userAgent.slice(0, 300),
    });
    // keepalive — чтобы репорт ушёл, даже если страница уже выгружается.
    void fetch(`${apiBaseUrl}client-errors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Молча: не отправлять «ошибку об ошибке».
    });
  } catch {
    // Сериализация/сеть — глотаем, телеметрия вторична.
  }
}
