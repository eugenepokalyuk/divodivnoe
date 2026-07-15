import React, { FC } from 'react';

import { PromotionCard, PromotionCardSkeleton } from '@/components/modules';
import { Button, Section } from '@/components/ui';
import type { Promotion } from '@/store/api/shopApi';
import { Contacts } from '@/utils/consts';

import classes from './PromotionsViewLayout.module.scss';

interface Props {
  promotions?: Promotion[];
  isLoading?: boolean;
  isError?: boolean;
}

/** Сколько заглушек рисовать на время загрузки: столько акций сейчас
 *  в админке. Разъедется только первый кадр, не вёрстка. */
const SKELETON_COUNT = 2;

export const PromotionsViewLayout: FC<Props> = ({
  promotions,
  isLoading,
  isError,
}) => (
  <Section
    overline="Акции"
    title="Действующие акции"
    description="В Telegram и WhatsApp сообщение подставится само — останется отправить. В MAX назовите промокод, и флорист подтвердит скидку."
  >
    {isLoading && (
      <ul className={classes.grid} aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <PromotionCardSkeleton key={index} />
        ))}
      </ul>
    )}

    {!isLoading && !isError && !!promotions?.length && (
      <ul className={classes.grid}>
        {promotions.map((promotion) => (
          <li key={promotion.code}>
            <PromotionCard promotion={promotion} />
          </li>
        ))}
      </ul>
    )}

    {/* Ошибку и пустоту разделяем намеренно: сказать «акций нет», когда
        сервер лёг, — это соврать. Клиент уйдёт, решив, что предложить
        нам нечего. */}
    {!isLoading && (isError || !promotions?.length) && (
      <div className={classes.empty} role="status">
        <p className={classes.empty_text}>
          {isError
            ? 'Не получилось загрузить акции. Напишите флористу — расскажем, что действует сейчас.'
            : 'Сейчас действующих акций нет — но мы всегда рады собрать для вас что-то особенное.'}
        </p>
        <Button href={Contacts.Telegram} external variant="outlined">
          Написать флористу
        </Button>
      </div>
    )}
  </Section>
);
