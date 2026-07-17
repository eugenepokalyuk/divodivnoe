'use client';

import React, { FC, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { MinusIcon, PlusIcon } from '@/components/ui';

import classes from './FaqItem.module.scss';

interface Props {
  question: string;
  answer: string;
}

/** Один сворачиваемый вопрос-ответ.
 *
 *  Заголовок слева, иконка справа. По клику плюсик плавно сменяется
 *  минусом (кроссфейд с поворотом), а ответ раскрывается анимацией
 *  высоты — height:auto через framer-motion, чтобы не хардкодить
 *  высоту неизвестного заранее текста. */
export const FaqItem: FC<Props> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const answerId = useId();

  return (
    <li className={classes.item}>
      <button
        type="button"
        className={classes.header}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={answerId}
      >
        <span className={classes.question}>{question}</span>

        <span className={classes.icon} aria-hidden>
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="minus"
                className={classes.glyph}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MinusIcon />
              </motion.span>
            ) : (
              <motion.span
                key="plus"
                className={classes.glyph}
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <PlusIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={answerId}
            className={classes.answerWrap}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={classes.answer}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};
