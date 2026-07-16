import React, { FC, PropsWithChildren, ReactNode } from 'react';

import classes from './LegalPage.module.scss';

interface Props extends PropsWithChildren {
  title: string;
  /** Дата редакции документа — «16 июля 2026». */
  updated: string;
  /** Вводный абзац над основным текстом. */
  intro?: ReactNode;
}

/** Шаблон правовой страницы: заголовок, дата редакции и текст с типографикой.
 *
 *  Текст передаётся обычными тегами (h2/h3/p/ul/ol) — их стилизует .prose,
 *  чтобы в самих документах не таскать классы по каждому абзацу. */
export const LegalPage: FC<Props> = ({ title, updated, intro, children }) => (
  <section className={classes.page}>
    <div className={classes.container}>
      <header className={classes.header}>
        <p className={classes.overline}>Документы</p>
        <h1 className={classes.title}>{title}</h1>
        <p className={classes.updated}>Редакция от {updated}</p>
      </header>

      {intro && <div className={classes.intro}>{intro}</div>}

      <article className={classes.prose}>{children}</article>
    </div>
  </section>
);
