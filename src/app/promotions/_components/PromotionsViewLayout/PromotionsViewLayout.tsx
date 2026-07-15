import React, { FC } from 'react';

import { PromotionCard } from '@/components/modules';
import { Button, Section } from '@/components/ui';
import type { Promotion } from '@/store/slices/promotions';
import { Contacts } from '@/utils/consts';

import classes from './PromotionsViewLayout.module.scss';

interface Props {
  promotions: Promotion[];
}

export const PromotionsViewLayout: FC<Props> = ({ promotions }) => (
  <Section
    overline="Акции"
    title="Действующие акции"
    description="В Telegram и WhatsApp сообщение подставится само — останется отправить. В MAX назовите промокод, и флорист подтвердит скидку."
  >
    {promotions.length ? (
      <ul className={classes.grid}>
        {promotions.map((promotion) => (
          <li key={promotion.id}>
            <PromotionCard promotion={promotion} />
          </li>
        ))}
      </ul>
    ) : (
      <div className={classes.empty}>
        <p className={classes.empty_text}>
          Сейчас действующих акций нет — но мы всегда рады собрать для вас
          что-то особенное.
        </p>
        <Button href={Contacts.Telegram} external variant="outlined">
          Написать флористу
        </Button>
      </div>
    )}
  </Section>
);
