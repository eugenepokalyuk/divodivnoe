'use client';

import React, { FC } from 'react';

import { Section } from '@/components/ui';
import { useGetFaqsQuery } from '@/store/api/shopApi';

import { FaqItem } from './_components/FaqItem/FaqItem';

import classes from './FaqSection.module.scss';

/** Блок «Клиентам» — частые вопросы, последним на главной.
 *
 *  Вопросы заводит флорист в админке. Пустой блок читается как поломка
 *  вёрстки, поэтому пока вопросов нет — секции на странице просто нет
 *  (и пункт меню «Клиентам» тоже скрыт, см. useNavItems). На ошибку и
 *  загрузку тоже ничего не рисуем: блок необязательный. */
export const FaqSection: FC = () => {
  const { data: faqs, isError } = useGetFaqsQuery();

  if (isError || !faqs?.length) return null;

  return (
    <Section
      id="faq"
      overline="Клиентам"
      title="Частые вопросы"
      description="Собрали то, о чём спрашивают чаще всего. Не нашли ответ — напишите нам, подскажем."
    >
      <ul className={classes.list}>
        {faqs.map((faq) => (
          <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
        ))}
      </ul>
    </Section>
  );
};
