import { apiBaseUrl } from '@/store/api/shopApi';

/** Уже отправленные ошибки — чтобы один и тот же краш в цикле рендера не
 *  завалил бэкенд сотней одинаковых репортов. Живёт на время сессии. */
const alreadySent = new Set<string>();

interface ClientError {
  message: string;
  stack?: string;
  url?: string;
}

/** Сигнатуры чужого шума, который ловится в window.onerror, но к нашему коду
 *  отношения не имеет — репортить его флористу незачем.
 *
 *  - webkit.messageHandlers / sendDataToNative / sendPageHideMessage — скрипт,
 *    который Meta впрыскивает во встроенный браузер Instagram/Facebook; на iOS
 *    он сам падает при уходе со страницы, когда window.webkit недоступен.
 *  - «script error» — обезличенная кросс-доменная ошибка без деталей (чаще
 *    всего расширения браузера), чинить в ней нечего.
 *  - «resizeobserver loop» — доброкачественное предупреждение спеки, не баг:
 *    браузер не успел разложить наблюдаемые элементы за один кадр.
 *  - chrome-/moz-/safari-extension — код расширений браузера, не наш. */
const NOISE_SIGNATURES = [
  'webkit.messagehandlers',
  'senddatatonative',
  'sendpagehidemessage',
  'script error',
  'resizeobserver loop',
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
];

/** Стек целиком из кадров, которые нельзя привязать к файлу, — значит, код
 *  пришёл из eval/new Function, а не из наших чанков.
 *
 *  Наш бандл раздаётся с https://divodivnoe.com/_next/…, поэтому у любого
 *  своего кадра есть URL со схемой. Кадры вида `(<anonymous>:1:3085)` или
 *  `(native)` оставляют только расширения браузера: они впрыскивают скрипт
 *  строкой и патчат встроенные объекты. Классика — взаимная рекурсия из
 *  нескольких расширений, перезаписавших Object.getOwnPropertyDescriptor
 *  поверх друг друга: получается «Maximum call stack size exceeded» с
 *  бесконечным `[as _getOwnPropertyDescriptor]` и без единой нашей строки.
 *
 *  Стек без кадров вообще (браузер не дал деталей) не трогаем — там нет
 *  оснований считать ошибку чужой, пусть доедет до телеграма. */
function isUnattributableStack(stack: string): boolean {
  const frames = stack.split('\n').filter((line) => /^\s*at\s|@/.test(line));
  return frames.length > 0 && frames.every((frame) => !frame.includes('://'));
}

/** Ошибка не из нашего кода — глушим, чтобы не спамить телеметрию. */
function isForeignNoise(message: string, stack: string): boolean {
  const haystack = `${message} ${stack}`.toLowerCase();
  if (NOISE_SIGNATURES.some((sig) => haystack.includes(sig))) return true;
  return isUnattributableStack(stack);
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

  if (isForeignNoise(message, stack)) return;

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
