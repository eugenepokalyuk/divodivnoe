'use client';

import React, { FC, useState } from 'react';

import { Button, ConsentNotice } from '@/components/ui';
import type { CartLine } from '@/store/slices/cart';
import { formatRuPhone } from '@/utils/helpers';

import type { AppliedPromo } from './checkPromo';
import {
  CONTACT_LABELS,
  CONTACT_ORDER,
  orderSchema,
  type ContactMethod,
} from './orderSchema';
import { PromoField } from './PromoField';
import { submitOrder, type OrderResult } from './submitOrder';

import classes from './OrderForm.module.scss';

interface Props {
  lines: CartLine[];
  /** Применённый промокод. Живёт в CartView: скидку показывает не только
   *  форма, но и «Итого» в сводке справа. */
  promo: AppliedPromo | null;
  onPromo: (promo: AppliedPromo | null) => void;
  onSuccess: (result: OrderResult) => void;
}

type Values = {
  firstName: string;
  lastName: string;
  phone: string;
  contactMethod: '' | ContactMethod;
  comment: string;
};

const EMPTY: Values = {
  firstName: '',
  lastName: '',
  phone: '',
  contactMethod: '',
  comment: '',
};

export const OrderForm: FC<Props> = ({ lines, promo, onPromo, onSuccess }) => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {},
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const parsed = orderSchema.safeParse(values);
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
      const result = await submitOrder({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        contactMethod: parsed.data.contactMethod as ContactMethod,
        comment: parsed.data.comment,
        lines,
        promoCode: promo?.code,
      });
      onSuccess(result);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <h3 className={classes.heading}>Оформление заказа</h3>

      <div className={classes.row}>
        <Field label="Имя" error={errors.firstName}>
          <input
            className={classes.input}
            value={values.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field label="Фамилия" error={errors.lastName}>
          <input
            className={classes.input}
            value={values.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            autoComplete="family-name"
          />
        </Field>
      </div>

      <Field label="Телефон для связи" error={errors.phone}>
        <input
          className={classes.input}
          value={values.phone}
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

      <Field label="Комментарий" error={errors.comment} optional>
        <textarea
          className={classes.textarea}
          value={values.comment}
          onChange={(e) => set('comment', e.target.value)}
          rows={3}
          placeholder="Пожелания к букету, дата и время, адрес — что угодно"
        />
      </Field>

      <PromoField
        lines={lines}
        phone={values.phone}
        applied={promo}
        onApply={onPromo}
      />

      {formError && (
        <p className={classes.formError} role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" color="primary" fullWidth disabled={submitting}>
        {submitting ? 'Оформляем…' : 'Оформить заказ'}
      </Button>

      <ConsentNotice action="Оформить заказ" withOffer />
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
  // <label>, а вложенные label — невалидный HTML.
  <div className={classes.field}>
    <span className={classes.label}>
      {label}
      {optional && <span className={classes.optional}> — необязательно</span>}
    </span>
    {children}
    {error && <span className={classes.error}>{error}</span>}
  </div>
);
