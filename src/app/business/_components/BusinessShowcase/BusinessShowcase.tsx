import React, { FC, PropsWithChildren } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

import classes from './BusinessShowcase.module.scss';

export interface ShowcaseItem {
  title: string;
  text?: string;
}

interface Props extends PropsWithChildren {
  image: string;
  alt: string;
  title: string;
  /** Абзац под заголовком. */
  lead?: React.ReactNode;
  /** Подзаголовок над списком пунктов. */
  itemsTitle?: string;
  items?: ShowcaseItem[];
  /** Короткий список одной строкой на пункт — без подзаголовков. */
  points?: string[];
  /** Фото справа — блоки страницы чередуются, чтобы не шли «лесенкой». */
  reversed?: boolean;
  /** Первый экран: заголовок крупнее, фото грузим сразу. */
  primary?: boolean;
  /** Над блоком — ссылка «назад», как у Section. Дети идут после текста. */
  top?: React.ReactNode;
}

/** Блок страницы «Для бизнеса»: фото на половину ширины и текст рядом.
 *  На мобиле фото уходит наверх, текст — под ним. */
export const BusinessShowcase: FC<Props> = ({
  image,
  alt,
  title,
  lead,
  itemsTitle,
  items,
  points,
  reversed,
  primary,
  top,
  children,
}) => {
  const Heading = primary ? 'h1' : 'h2';

  return (
    <section className={clsx(classes.section, reversed && classes.reversed)}>
      {top && <div className={classes.top}>{top}</div>}
      <div className={classes.container}>
        <div className={classes.media}>
          <Image
            src={image}
            alt={alt}
            fill
            priority={primary}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className={classes.image}
          />
        </div>

        <div className={classes.content}>
          <Heading className={primary ? classes.titlePrimary : classes.title}>
            {title}
          </Heading>

          {lead && <div className={classes.lead}>{lead}</div>}

          {itemsTitle && <p className={classes.itemsTitle}>{itemsTitle}</p>}

          {items && (
            <ul className={classes.items}>
              {items.map(({ title: itemTitle, text }) => (
                <li key={itemTitle} className={classes.item}>
                  <h3 className={classes.itemTitle}>{itemTitle}</h3>
                  {text && <p className={classes.itemText}>{text}</p>}
                </li>
              ))}
            </ul>
          )}

          {points && (
            <ul className={classes.points}>
              {points.map((point) => (
                <li key={point} className={classes.point}>
                  {point}
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};
