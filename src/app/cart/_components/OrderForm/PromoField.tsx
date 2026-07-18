'use client';

import React, { FC, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { CheckIcon, CloseIcon } from '@/components/ui';
import { Goals, reachGoal } from '@/lib/analytics/metrika';
import type { CartLine } from '@/store/slices/cart';
import { isCompleteRuPhone } from '@/utils/helpers';

import { checkPromo, type AppliedPromo } from './checkPromo';

import classes from './OrderForm.module.scss';

interface Props {
  lines: CartLine[];
  /** Телефон из формы: по нему сервер проверяет «один раз на клиента». */
  phone: string;
  applied: AppliedPromo | null;
  onApply: (promo: AppliedPromo | null) => void;
}

/** Поле промокода на оформлении. Один промокод на заказ — поэтому это
 *  одно поле, а применённый код заменяется, а не складывается.
 *
 *  Проверяем на сервере по кнопке, а не на каждый символ: код вводят
 *  один раз, а лишние запросы на каждую букву били бы по бэкенду.
 *  Скидка при оформлении пересчитается ещё раз — здесь она показана. */
export const PromoField: FC<Props> = ({ lines, phone, applied, onApply }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const apply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    // Телефон нужен серверу для проверки — просим его раньше, чем
    // отправим заведомо бесполезный запрос.
    if (!isCompleteRuPhone(phone)) {
      setError('Сначала укажите телефон — промокод привязан к нему.');
      return;
    }

    setError(null);
    setChecking(true);
    try {
      const promo = await checkPromo(trimmed, phone, lines);
      onApply(promo);
      reachGoal(Goals.PromoApplied, { code: promo.code });
    } catch (e) {
      setError((e as Error).message);
      onApply(null);
    } finally {
      setChecking(false);
    }
  };

  const reset = () => {
    onApply(null);
    setCode('');
    setError(null);
  };

  if (applied) {
    return (
      <motion.div
        className={classes.promoApplied}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
      >
        <CheckIcon />
        <span className={classes.promoAppliedText}>
          <b>{applied.code}</b> — {applied.title}
        </span>
        <button
          type="button"
          className={classes.promoRemove}
          onClick={reset}
          aria-label="Убрать промокод"
        >
          <CloseIcon />
        </button>
      </motion.div>
    );
  }

  return (
    <div className={classes.field}>
      <span className={classes.label}>
        Промокод<span className={classes.optional}> — если есть</span>
      </span>

      <div className={classes.promoRow}>
        <input
          className={classes.input}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          // Enter в поле промокода должен применять код, а не отправлять
          // весь заказ: форма одна, и без этого «Применить» не нажать
          // с клавиатуры, не оформив заказ по дороге.
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void apply();
            }
          }}
          placeholder="Например, promo500"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          className={classes.promoApply}
          onClick={apply}
          disabled={checking || !code.trim()}
        >
          {checking ? 'Проверяем…' : 'Применить'}
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.span
            className={classes.error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
