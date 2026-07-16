import React, { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@/utils/consts';

import classes from './ConsentNotice.module.scss';

interface Props {
  /** Подпись кнопки, под которой стоит уведомление, — «Оформить заказ» и т. п. */
  action: string;
  /** Заказ — это ещё и договор, поэтому у него в согласии есть оферта.
   *  У заявки-намёка покупки нет — только обработка данных. */
  withOffer?: boolean;
}

/** Строка согласия под кнопкой формы: делает согласие на обработку данных
 *  информированным (152-ФЗ) — пользователь видит, с чем соглашается, и ссылки
 *  на документы прямо в точке отправки данных. */
export const ConsentNotice: FC<Props> = ({ action, withOffer }) => (
  <p className={classes.notice}>
    Нажимая «{action}», вы соглашаетесь с{' '}
    <Link href={Routes.Privacy} className={classes.link}>
      политикой обработки персональных данных
    </Link>{' '}
    и{' '}
    {withOffer ? (
      <Link href={Routes.Offer} className={classes.link}>
        условиями оферты
      </Link>
    ) : (
      <Link href={Routes.Consent} className={classes.link}>
        обработкой персональных данных
      </Link>
    )}
    .
  </p>
);
