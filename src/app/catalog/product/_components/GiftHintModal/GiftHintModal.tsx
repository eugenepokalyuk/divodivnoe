'use client';

import React, { FC, useState } from 'react';
import Image from 'next/image';
import { z } from 'zod';

import { Button, Modal } from '@/components/ui';
import { formatPrice, formatRuPhone, isCompleteRuPhone } from '@/utils/helpers';

import { submitGiftHint } from './submitGiftHint';

import classes from './GiftHintModal.module.scss';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product;
}

const schema = z.object({
  senderName: z.string().trim().min(1, 'Как вас зовут?'),
  recipientName: z.string().trim().min(1, 'Кому намекнуть?'),
  phone: z.string().refine(isCompleteRuPhone, 'Введите номер телефона полностью'),
});

type Values = z.infer<typeof schema>;

const EMPTY: Values = { senderName: '', recipientName: '', phone: '' };

export const GiftHintModal: FC<Props> = ({ open, onClose, product }) => {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const close = () => {
    onClose();
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
      await submitGiftHint({ ...parsed.data, productId: product.id });
      setDone(true);
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Намекнуть о подарке"
      description={
        done
          ? undefined
          : 'Оставьте контакт — флорист деликатно свяжется и предложит именно выбранную вами позицию.'
      }
    >
      {done ? (
        <div className={classes.success} role="status">
          <p className={classes.successText}>
            Готово! Флорист свяжется деликатно и всё устроит. Спасибо 🌷
          </p>
          <Button variant="outlined" fullWidth onClick={close}>
            Закрыть
          </Button>
        </div>
      ) : (
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Field label="Ваше имя" error={errors.senderName}>
            <input
              className={classes.input}
              value={values.senderName}
              onChange={(e) => set('senderName', e.target.value)}
              autoComplete="given-name"
            />
          </Field>

          <Field label="Кому намекнуть" error={errors.recipientName}>
            <input
              className={classes.input}
              value={values.recipientName}
              onChange={(e) => set('recipientName', e.target.value)}
              placeholder="Имя человека"
            />
          </Field>

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

          <div className={classes.product}>
            <span className={classes.productThumb}>
              {product.image && (
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="64px"
                  className={classes.productImage}
                />
              )}
            </span>
            <div className={classes.productInfo}>
              <p className={classes.productLabel}>Выбранная позиция</p>
              <p className={classes.productName}>{product.name}</p>
              <p className={classes.productPrice}>{formatPrice(product.price)}</p>
            </div>
          </div>

          {formError && (
            <p className={classes.formError} role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" color="primary" fullWidth disabled={submitting}>
            {submitting ? 'Отправляем…' : 'Намекнуть'}
          </Button>
        </form>
      )}
    </Modal>
  );
};

const Field: FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className={classes.field}>
    <span className={classes.fieldLabel}>{label}</span>
    {children}
    {error && <span className={classes.fieldError}>{error}</span>}
  </div>
);
