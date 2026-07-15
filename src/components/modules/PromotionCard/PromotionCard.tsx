import React, { FC } from 'react';

import { Button } from '@/components/ui';
import type { Promotion } from '@/store/slices/promotions';
import { Contacts } from '@/utils/consts';
import { buildPromotionTelegramLink } from '@/utils/helpers';

import classes from './PromotionCard.module.scss';

interface Props {
  promotion: Promotion;
}

/** В Telegram уходит готовое сообщение с названием акции и промокодом.
 *  MAX так не умеет — там ссылка просто открывает чат магазина, поэтому
 *  промокод вынесен на карточку, чтобы клиент мог его назвать. */
export const PromotionCard: FC<Props> = ({ promotion }) => (
  <article className={classes.card}>
    <span className={classes.badge}>{promotion.badge}</span>

    <div className={classes.body}>
      <h3 className={classes.title}>{promotion.title}</h3>
      <p className={classes.description}>{promotion.description}</p>
      {promotion.terms && <p className={classes.terms}>{promotion.terms}</p>}
    </div>

    <p className={classes.code_row}>
      Промокод <span className={classes.code}>{promotion.code}</span>
    </p>

    <div className={classes.actions}>
      <Button
        href={buildPromotionTelegramLink(promotion)}
        external
        size="small"
      >
        Забрать в Telegram
      </Button>

      <Button href={Contacts.Max} external size="small" variant="outlined">
        Написать в MAX
      </Button>
    </div>
  </article>
);
