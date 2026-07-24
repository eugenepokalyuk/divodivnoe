'use client';

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';

import { Button, ChatIcon, ConsentNotice, Modal } from '@/components/ui';
import { formatRuPhone, isCompleteRuPhone } from '@/utils/helpers';

import { submitFeedback } from './submitFeedback';

import classes from './FeedbackFab.module.scss';

const schema = z.object({
  phone: z.string().refine(isCompleteRuPhone, 'Введите номер телефона полностью'),
  comment: z.string().trim().optional(),
});

type Values = z.infer<typeof schema>;

const EMPTY: Values = { phone: '', comment: '' };

/** Плавающая кнопка чата (справа снизу) с формой обратной связи.
 *
 *  Открывает окно, где посетитель оставляет телефон и комментарий. Отправка
 *  уходит на бэкенд, а он пересылает заявку в Telegram флористу (см.
 *  submitFeedback). Всегда на виду поверх страниц — рядом с корзиной
 *  (CartFab стоит выше, чтобы не перекрывать друг друга). */
export const FeedbackFab: FC = () => {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    setOpen(false);
    // Сброс после закрытия, чтобы не мелькало при анимации размонтирования.
    setTimeout(() => {
      setValues(EMPTY);
      setErrors({});
      setFormError(null);
      setDone(false);
    }, 200);
  };

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof Values, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof Values;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback({
        phone: parsed.data.phone,
        comment: parsed.data.comment,
      });
      setDone(true);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        className={classes.fab}
        aria-label="Обратная связь"
        onClick={() => setOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChatIcon className={classes.icon} />
      </motion.button>

      <Modal
        open={open}
        onClose={close}
        title="Обратная связь"
        description={
          done
            ? undefined
            : 'Оставьте телефон — перезвоним, ответим на вопросы и поможем с заказом.'
        }
      >
        {done ? (
          <div className={classes.success} role="status">
            <p className={classes.successText}>
              Готово! Мы свяжемся с вами в ближайшее время. Спасибо 🌷
            </p>
            <Button variant="outlined" fullWidth onClick={close}>
              Закрыть
            </Button>
          </div>
        ) : (
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <div className={classes.field}>
              <span className={classes.fieldLabel}>Телефон для связи</span>
              <input
                className={classes.input}
                value={values.phone}
                onChange={(e) => set('phone', formatRuPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                inputMode="tel"
                autoComplete="tel"
              />
              {errors.phone && (
                <span className={classes.fieldError}>{errors.phone}</span>
              )}
            </div>

            <div className={classes.field}>
              <span className={classes.fieldLabel}>
                Комментарий
                <span className={classes.optional}> — необязательно</span>
              </span>
              <textarea
                className={classes.textarea}
                value={values.comment}
                onChange={(e) => set('comment', e.target.value)}
                rows={3}
                placeholder="Коротко о том, чем помочь"
              />
            </div>

            {formError && (
              <p className={classes.formError} role="alert">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              color="primary"
              fullWidth
              className={classes.submit}
              disabled={submitting}
            >
              {submitting ? 'Отправляем…' : 'Оставить заявку'}
            </Button>

            <ConsentNotice action="Оставить заявку" />
          </form>
        )}
      </Modal>
    </>
  );
};
