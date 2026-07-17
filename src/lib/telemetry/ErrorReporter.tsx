'use client';

import { FC, useEffect } from 'react';

import { reportClientError } from './reportClientError';

/** Глобальный перехват необработанных ошибок и промисов.
 *
 *  React error boundary (error.tsx) ловит только падения рендера; ошибки в
 *  обработчиках, таймерах и отклонённые промисы проходят мимо него — их
 *  и подбираем здесь. Ничего не рисует. */
export const ErrorReporter: FC = () => {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportClientError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      reportClientError({
        message: reason?.message ?? String(reason),
        stack: reason?.stack,
        url: window.location.href,
      });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
};
