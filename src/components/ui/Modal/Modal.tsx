'use client';

import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { CloseIcon } from '../Icons/Icons';

import classes from './Modal.module.scss';

interface Props extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Подзаголовок под заголовком — необязательный. */
  description?: string;
}

/** Простое модальное окно без зависимостей по разметке.
 *
 *  Портал в body (иначе overflow/z-index родителей обрезали бы окно),
 *  закрытие по Esc, по клику на подложку и по крестику. Появление и уход
 *  анимированы (AnimatePresence): подложка растворяется, окно всплывает.
 *  Портал ставим только после mount: сайт статический, на сборке document нет. */
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={classes.overlay}
          onClick={onClose}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={classes.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            // Клик внутри окна не должен закрывать его — гасим всплытие.
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.button
              type="button"
              className={classes.close}
              onClick={onClose}
              whileTap={{ scale: 0.85 }}
              aria-label="Закрыть"
            >
              <CloseIcon />
            </motion.button>

            <header className={classes.header}>
              <h2 className={classes.title}>{title}</h2>
              {description && (
                <p className={classes.description}>{description}</p>
              )}
            </header>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
