import React, { FC } from 'react';

import { CompanyName } from '@/utils/consts';

import classes from './AboutIntro.module.scss';

export const AboutIntro: FC = () => (
  <div className={classes.intro}>
    <p className={classes.overline}>О нас</p>

    <h2 className={classes.title}>
      Цветы — это способ сказать то, что сложно словами
    </h2>

    <p className={classes.text}>
      «{CompanyName}» — небольшая мастерская авторской флористики. Мы не
      собираем букеты по шаблону: спрашиваем про повод, про человека, про то,
      какое чувство нужно передать — и складываем это в цветы.
    </p>
  </div>
);
