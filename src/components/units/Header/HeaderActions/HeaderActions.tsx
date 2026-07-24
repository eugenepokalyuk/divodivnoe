import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { Contacts } from '@/utils/consts';

import { MobileMenu } from '../MobileMenu/MobileMenu';

import classes from './HeaderActions.module.scss';

/** Правый край шапки. На десктопе (от lg) пусто: навигация с контактами
 *  живёт в HeaderNav. Ниже lg — одно действие «Позвонить» и бургер справа
 *  от него, за которым спрятано всё меню целиком (MobileMenu). */
export const HeaderActions: FC = () => (
  <div className={classes.actions}>
    <Button href={Contacts.Phone} external size="small" variant="outlined">
      Позвонить
    </Button>

    <MobileMenu />
  </div>
);
