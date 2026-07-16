'use client';

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { CloseIcon } from '../Icons/Icons';

import classes from './Modal.module.scss';

interface Props extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Подзаголовок под заголовком — необязательный. */
  description?: string;
}

/** Простое модальное окно без зависимостей.
 *
 *  Портал в body (иначе overflow/z-index родителей обрезали бы окно),
 *  закрытие по Esc, по клику на подложку и по крестику. Пока окно открыто —
 *  блокируем прокрутку страницы под ним. Портал ставим только после mount:
 *  сайт статический, на сборке document нет. */
export const Modal: FC<Props> = ({
  open,
  onClose,
  title,
  description,
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Прокрутку фона гасим, чтобы страница не «уезжала» под окном.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className={classes.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={classes.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // Клик внутри окна не должен закрывать его — гасим всплытие на подложку.
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={classes.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <CloseIcon />
        </button>

        <header className={classes.header}>
          <h2 className={classes.title}>{title}</h2>
          {description && <p className={classes.description}>{description}</p>}
        </header>

        {children}
      </div>
    </div>,
    document.body,
  );
};
