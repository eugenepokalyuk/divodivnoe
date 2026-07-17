'use client';

import { FC, useEffect } from 'react';

import { reportClientError } from '@/lib/telemetry/reportClientError';

/** Аварийный экран на случай падения в самом корневом лэйауте.
 *
 *  global-error заменяет собой всё дерево, включая <html>/<body> и стили
 *  сайта, поэтому размечен самодостаточно и с инлайновыми стилями — здесь
 *  нельзя рассчитывать ни на шрифты, ни на globals.scss. Случай редкий, но
 *  без него белый экран без единой подсказки. */
const GlobalError: FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  useEffect(() => {
    reportClientError({
      message: `[global] ${error.message}`,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#FBF9F7',
          color: '#1C1A1B',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>
            Сайт временно недоступен
          </h1>
          <p style={{ color: '#7C7377', marginBottom: 24 }}>
            Мы уже получили сигнал об ошибке. Попробуйте обновить страницу.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              color: '#fff',
              background: '#8F5B6B',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            Обновить
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
