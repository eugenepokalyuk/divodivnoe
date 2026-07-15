import React, { FC } from 'react';

import classes from './ReviewCard.module.scss';

export interface Review {
  /** Имя автора — как отзыв подписан в 2ГИС. Анонимно не переносим:
   *  текст принадлежит тому, кто его написал. */
  author: string;
  /** Дата в человекочитаемом виде: «март 2026». */
  date: string;
  /** Оценка автора, 1–5. */
  rating: number;
  text: string;
}

const MAX_RATING = 5;

export const ReviewCard: FC<Review> = ({ author, date, rating, text }) => (
  <li className={classes.review}>
    {/* Звёзды — картинка для скринридера: он читает aria-label, а не ряд ★. */}
    <span
      className={classes.rating}
      role="img"
      aria-label={`Оценка ${rating} из ${MAX_RATING}`}
    >
      {'★'.repeat(rating)}
      <span className={classes.ratingEmpty}>
        {'★'.repeat(MAX_RATING - rating)}
      </span>
    </span>

    <p className={classes.text}>{text}</p>

    <footer className={classes.meta}>
      <span className={classes.author}>{author}</span>
      <span className={classes.date}>{date}</span>
    </footer>
  </li>
);
