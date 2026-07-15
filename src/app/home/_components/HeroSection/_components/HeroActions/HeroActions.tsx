import React, { FC } from 'react';

import { Button, MessengerActions } from '@/components/ui';
import { CompanyDomain, Routes } from '@/utils/consts';

import classes from './HeroActions.module.scss';

const HERO_MESSAGE = `Здравствуйте! Я с сайта ${CompanyDomain}, хочу собрать букет`;

export const HeroActions: FC = () => (
  <div className={classes.actions}>
    <Button href={Routes.Catalog} fullWidth className={classes.cta}>
      Смотреть каталог
    </Button>

    <div className={classes.write}>
      <p className={classes.label}>Или напишите флористу:</p>
      <MessengerActions message={HERO_MESSAGE} />
    </div>
  </div>
);
