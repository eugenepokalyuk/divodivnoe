import React, { FC } from 'react';

import { ExternalLink, Section } from '@/components/ui';
import { Company2gisReviews } from '@/utils/consts';

import { Review, ReviewCard } from './_components/ReviewCard/ReviewCard';

import classes from './ReviewsSection.module.scss';

/** Выборка отзывов с карточки 2ГИС — переносим вручную, с именем автора
 *  и ссылкой на первоисточник внизу секции. Тексты пишут клиенты, поэтому
 *  сюда попадает только то, что реально оставлено в 2ГИС: выдумывать
 *  отзывы нельзя, это обман покупателя. */
const REVIEWS: Review[] = [];

export const ReviewsSection: FC = () => {
  // Пустая секция с заголовком «Отзывы» читается как поломка вёрстки,
  // поэтому до появления текстов блока на странице просто нет.
  if (!REVIEWS.length) return null;

  return (
    <Section
      id="reviews"
      overline="Отзывы"
      title="Что говорят клиенты"
      description="Собрали часть отзывов с нашей карточки в 2ГИС — там же можно прочитать остальные и оставить свой."
    >
      <ul className={classes.grid}>
        {REVIEWS.map((review) => (
          <ReviewCard key={`${review.author}-${review.date}`} {...review} />
        ))}
      </ul>

      <p className={classes.footer}>
        <ExternalLink href={Company2gisReviews} className={classes.link}>
          Все отзывы на 2ГИС
        </ExternalLink>
      </p>
    </Section>
  );
};
