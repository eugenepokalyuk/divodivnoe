'use client';

import React, { FC, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';

import { ExternalLink, Section } from '@/components/ui';
import { useGetReviewsQuery } from '@/store/api/shopApi';
import { Company2gisReviews } from '@/utils/consts';

import { ReviewCard } from './_components/ReviewCard/ReviewCard';

import classes from './ReviewsSection.module.scss';

/** Отзывы клиентов — горизонтальный слайдер, который плавно едет сам.
 *
 *  Тексты и аватары заводит флорист в админке (см. content.Review
 *  в divo_bot). Пустая секция с заголовком «Отзывы» читается как
 *  поломка вёрстки, поэтому пока отзывов нет — блока на странице просто
 *  нет. На ошибку и загрузку тоже ничего не рисуем: секция необязательная.
 *
 *  Автопрокрутка — плагин embla-carousel-auto-scroll: лента едет
 *  непрерывно, как бегущая строка, пауза при наведении. Тем, кто просил
 *  систему убавить анимацию (prefers-reduced-motion), плагин не
 *  включаем — лента остаётся статичной, листается вручную. */
export const ReviewsSection: FC = () => {
  const { data: reviews, isError } = useGetReviewsQuery();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    reducedMotion
      ? []
      : [
          AutoScroll({
            speed: 1,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ],
  );

  if (isError || !reviews?.length) return null;

  return (
    <Section
      id="reviews"
      overline="Отзывы"
      title="Что говорят клиенты"
      description="Живые отзывы наших покупателей. Полную ленту можно прочитать в нашей карточке 2ГИС — там же оставить свой."
    >
      <div className={classes.viewport} ref={emblaRef}>
        <ul className={classes.track}>
          {reviews.map((review) => (
            <li className={classes.slide} key={review.id}>
              <ReviewCard {...review} />
            </li>
          ))}
        </ul>
      </div>

      <p className={classes.footer}>
        <ExternalLink href={Company2gisReviews} className={classes.link}>
          Все отзывы на 2ГИС
        </ExternalLink>
      </p>
    </Section>
  );
};
