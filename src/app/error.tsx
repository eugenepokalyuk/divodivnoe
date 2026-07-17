'use client';

import { FC, useEffect } from 'react';

import { Button, Section } from '@/components/ui';
import { reportClientError } from '@/lib/telemetry/reportClientError';
import { Routes } from '@/utils/consts';

/** Экран на случай падения рендера внутри страницы.
 *
 *  Заменяет собой пустое «This page couldn't load»: человек видит
 *  понятный текст и куда идти дальше, а флорист — репорт в телеграм.
 *  reset() пробует перерисовать сегмент (часто помогает при разовом
 *  сбое сети/данных). */
const AppError: FC<{
  error: Error & { digest?: string };
  reset: () => void;
}> = ({ error, reset }) => {
  useEffect(() => {
    reportClientError({
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [error]);

  return (
    <Section overline="Ошибка" title="Что-то пошло не так">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 460,
        }}
      >
        <p style={{ color: 'var(--text_secondary)' }}>
          Мы уже получили сигнал и разбираемся. Попробуйте обновить страницу или
          вернитесь в каталог — букеты на месте.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={reset} color="primary">
            Обновить
          </Button>
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default AppError;
