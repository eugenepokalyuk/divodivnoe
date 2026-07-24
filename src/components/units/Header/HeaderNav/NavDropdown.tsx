'use client';

import React, { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { ChevronDownIcon } from '@/components/ui';

import classes from './NavDropdown.module.scss';

interface Props extends PropsWithChildren {
  label: string;
}

/** Пункт-дропдаун десктопной шапки: триггер + всплывающая панель.
 *
 *  Открываем по наведению (мышью удобнее) и по клику/Enter (клавиатура и
 *  тач). Закрываем по Esc, по клику вне и когда фокус ушёл за пределы —
 *  чтобы панель не висела открытой. Панель отрисована всегда, показ/скрытие
 *  через data-open + CSS: так внутренние ссылки остаются в потоке табуляции
 *  предсказуемо, а переход анимируется. */
export const NavDropdown: FC<Props> = ({ label, children }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={classes.root}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Фокус ушёл из группы (Tab дальше) — закрываем панель.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={classes.trigger}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <ChevronDownIcon className={classes.chevron} data-open={open} />
      </button>

      <div className={classes.panel} data-open={open} role="menu">
        {children}
      </div>
    </div>
  );
};
