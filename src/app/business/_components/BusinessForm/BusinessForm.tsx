'use client';

import React, { FC, useState } from 'react';
import { z } from 'zod';

import { Button, ConsentNotice } from '@/components/ui';
import {
  CONTACT_LABELS,
  CONTACT_METHODS,
  CONTACT_ORDER,
  type ContactMethod,
} from '@/app/cart/_components/OrderForm/orderSchema';
import { formatRuPhone, isCompleteRuPhone } from '@/utils/helpers';

import { submitBusinessRequest } from './submitBusinessRequest';

import classes from './BusinessForm.module.scss';

const schema = z.object({
  firstName: z.string().trim().min(1, 'Укажите имя'),
  lastName: z.string().trim().min(1, 'Укажите фамилию'),
  company: z.string().trim().min(1, 'Укажите название компании'),
  phone: z
    .string()
    .refine(isCompleteRuPhone, 'Введите номер телефона полностью'),
  contactMethod: z
    .string()
    .refine(
      (v): v is ContactMethod => CONTACT_METHODS.includes(v as ContactMethod),
      'Выберите, как с вами удобно связаться',
    ),
  task: z.string().trim().max(1000, 'Слишком длинное описание').optional(),
});

type Values = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  contactMethod: '' | ContactMethod;
  telegramUsername: string;
  task: string;
};

const EMPTY: Values = {
  firstName: '',
  lastName: '',
  company: '',
  phone: '',
  contactMethod: '',
  telegramUsername: '',
  task: '',
};

/** Заявка на сотрудничество со страницы «Для бизнеса»: уходит на бэкенд
 *  (POST /business-requests/ → админка и телеграм флористу). */
export const BusinessForm: FC = () => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
      await submitBusinessRequest({
        ...parsed.data,
        contactMethod: parsed.data.contactMethod as ContactMethod,
        // Ник шлём только если выбран Telegram — иначе он ни к чему.
        telegramUsername:
          parsed.data.contactMethod === 'telegram'
            ? values.telegramUsername.trim()
            : '',
      });
      setDone(true);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className={classes.success} role="status">
        <p className={classes.successTitle}>{'Заявка отправлена'}</p>
        <p className={classes.successText}>
          {'Менеджер свяжется с вами в ближайшее время. Спасибо 🌷'}
        </p>
      </div>
    );
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <div className={classes.row}>
        <Field label="Имя" error={errors.firstName}>
          <input
            className={classes.input}
            value={values.firstName}
            aria-invalid={Boolean(errors.firstName)}
            onChange={(e) => set('firstName', e.target.value)}
            autoComplete="given-name"
          />
        </Field>

        <Field label="Фамилия" error={errors.lastName}>
          <input
            className={classes.input}
            value={values.lastName}
            aria-invalid={Boolean(errors.lastName)}
            onChange={(e) => set('lastName', e.target.value)}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field label="Название компании" error={errors.company}>
        <input
          className={classes.input}
          value={values.company}
          aria-invalid={Boolean(errors.company)}
          onChange={(e) => set('company', e.target.value)}
          autoComplete="organization"
        />
      </Field>

      <Field label="Телефон для связи" error={errors.phone}>
        <input
          className={classes.input}
          value={values.phone}
          aria-invalid={Boolean(errors.phone)}
          onChange={(e) => set('phone', formatRuPhone(e.target.value))}
          placeholder="+7 (___) ___-__-__"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>

      <Field label="Как с вами удобно связаться" error={errors.contactMethod}>
        <div className={classes.methods}>
          {CONTACT_ORDER.map((method) => (
            <label
              key={method}
              className={classes.method}
              data-active={values.contactMethod === method}
            >
              <input
                type="radio"
                name="contactMethod"
                value={method}
                checked={values.contactMethod === method}
                onChange={() => set('contactMethod', method)}
                className={classes.methodInput}
              />
              {CONTACT_LABELS[method]}
            </label>
          ))}
        </div>
      </Field>

      {/* Как в корзине: ник появляется только при выборе Telegram, телефон
          остаётся всегда. */}
      {values.contactMethod === 'telegram' && (
        <Field label="Ваш Telegram" optional>
          <input
            className={classes.input}
            value={values.telegramUsername}
            onChange={(e) => set('telegramUsername', e.target.value)}
            placeholder="@username"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <span className={classes.hintText}>
            {'Если не знаете ник — оставьте пусто, свяжемся по телефону'}
          </span>
        </Field>
      )}

      <Field label="Краткое описание задачи" error={errors.task} optional>
        <textarea
          className={classes.textarea}
          value={values.task}
          aria-invalid={Boolean(errors.task)}
          onChange={(e) => set('task', e.target.value)}
          rows={3}
          placeholder="Например: букеты в офис каждую неделю или оформление мероприятия"
        />
      </Field>

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
        {submitting ? 'Отправляем…' : 'Отправить заявку'}
      </Button>

      <ConsentNotice action="Отправить заявку" />
    </form>
  );
};

const Field: FC<{
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, error, optional, children }) => (
  // div, а не label: в группе способов связи внутри лежат radio со своими
  // <label>, а вложенные label — невалидный HTML
  <div className={classes.field}>
    <span className={classes.label}>
      {label}
      {optional && <span className={classes.optional}> — необязательно</span>}
    </span>

    {children}

    {error && <span className={classes.error}>{error}</span>}
  </div>
);
