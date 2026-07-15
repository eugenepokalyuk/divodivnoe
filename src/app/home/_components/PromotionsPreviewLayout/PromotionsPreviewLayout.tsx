import React, { FC } from 'react';

import { PromotionCard } from '@/components/modules';
import { Button, Section } from '@/components/ui';
import type { Promotion } from '@/store/slices/promotions';
import { Routes } from '@/utils/consts';

import classes from './PromotionsPreviewLayout.module.scss';

interface Props {
  promotions: Promotion[];
}

export const PromotionsPreviewLayout: FC<Props> = ({ promotions }) => (
  <Section
    className={classes.section}
    overline="Акции"
    title="Действующие предложения"
    description="В Telegram сообщение подставится само — останется отправить. В MAX назовите промокод с карточки."
  >
    <ul className={classes.grid}>
      {promotions.map((promotion) => (
        <li key={promotion.id}>
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
