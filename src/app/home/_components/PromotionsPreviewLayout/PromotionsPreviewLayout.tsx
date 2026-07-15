import React, { FC } from 'react';

import { PromotionCard, PromotionCardSkeleton } from '@/components/modules';
import { Button, Section } from '@/components/ui';
import type { Promotion } from '@/store/api/shopApi';
import { Routes } from '@/utils/consts';

import classes from './PromotionsPreviewLayout.module.scss';

interface Props {
  promotions?: Promotion[];
  isLoading?: boolean;
}

/** Сколько заглушек рисовать на время загрузки: столько акций сейчас
 *  в админке. Разъедется только первый кадр, не вёрстка. */
const SKELETON_COUNT = 2;

export const PromotionsPreviewLayout: FC<Props> = ({
  promotions,
  isLoading,
}) => (
  <Section
    className={classes.section}
    overline="Акции"
    title="Действующие предложения"
    description="В Telegram и WhatsApp сообщение подставится само — останется отправить. В MAX назовите промокод с карточки."
  >
    <ul className={classes.grid} aria-busy={isLoading}>
      {isLoading
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <PromotionCardSkeleton key={index} />
          ))
        : promotions?.map((promotion) => (
            <li key={promotion.code}>
              <PromotionCard promotion={promotion} />
            </li>
          ))}
    </ul>

    <div className={classes.footer}>
      <Button href={Routes.Promotions} variant="outlined">
        Все акции
      </Button>
    </div>
  </Section>
);
