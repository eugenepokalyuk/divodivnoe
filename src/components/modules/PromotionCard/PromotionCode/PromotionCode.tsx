import React, { FC } from 'react';

import classes from './PromotionCode.module.scss';

interface Props {
  code: string;
}

/** Промокод нужен ради MAX: там ссылка не умеет подставлять текст в чат,
 *  поэтому клиент называет код сам. */
export const PromotionCode: FC<Props> = ({ code }) => (
  <p className={classes.row}>
    Промокод <span className={classes.code}>{code}</span>
  </p>
);
