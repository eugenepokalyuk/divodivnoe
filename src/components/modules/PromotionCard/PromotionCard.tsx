import React, { FC } from 'react';

import { MessengerActions } from '@/components/ui';
import type { Promotion } from '@/store/api/shopApi';
import { buildPromotionLink } from '@/utils/helpers';

import { PromotionCode } from './PromotionCode/PromotionCode';

import classes from './PromotionCard.module.scss';

interface Props {
  promotion: Promotion;
}

/** В Telegram и WhatsApp уходит готовое сообщение с названием акции
 *  и промокодом. MAX так не умеет — там ссылка просто открывает чат. */
export const PromotionCard: FC<Props> = ({ promotion }) => (
  <article className={classes.card}>
    <span className={classes.badge}>{promotion.badge}</span>

    <div className={classes.body}>
      <h3 className={classes.title}>{promotion.title}</h3>
      <p className={classes.description}>{promotion.description}</p>
      {promotion.terms && <p className={classes.terms}>{promotion.terms}</p>}
    </div>

    <PromotionCode code={promotion.code} />

    <div className={classes.footer}>
      <p className={classes.hint}>Забрать акцию:</p>
      <MessengerActions
        getHref={(messenger) => buildPromotionLink(promotion, messenger)}
      />
    </div>
  </article>
);
