import React, { FC } from 'react';
import Image from 'next/image';

import { ReviewDto } from '@/store/api/shopApi';

import classes from './ReviewCard.module.scss';

const MAX_RATING = 5;

/** Карточка отзыва в слайдере. Данные приходят из админки (ReviewDto):
 *  аватар, имя, текст и оценка. Аватар необязателен — без фото рисуем
 *  кружок с первой буквой имени. */
export const ReviewCard: FC<ReviewDto> = ({
  author_name,
  avatar,
  text,
  rating,
}) => (
  <article className={classes.review}>
    <header className={classes.head}>
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          width={56}
          height={56}
          className={classes.avatar}
        />
      ) : (
        <span className={classes.avatarFallback} aria-hidden>
          {author_name.trim().charAt(0).toUpperCase()}
        </span>
      )}

      <div className={classes.person}>
        <span className={classes.author}>{author_name}</span>

        {/* Звёзды — картинка для скринридера: он читает aria-label, а не ряд ★. */}
        <span
          className={classes.rating}
          role="img"
          aria-label={`Оценка ${rating} из ${MAX_RATING}`}
        >
          {'★'.repeat(rating)}
          <span className={classes.ratingEmpty}>
            {'★'.repeat(Math.max(0, MAX_RATING - rating))}
          </span>
        </span>
      </div>
    </header>

    <p className={classes.text}>{text}</p>
  </article>
);
