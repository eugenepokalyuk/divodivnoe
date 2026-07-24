import React, { FC } from 'react';

import { CompanyCity } from '@/utils/consts';

import { HeroActions } from './_components/HeroActions/HeroActions';
import { HeroMedia } from './_components/HeroMedia/HeroMedia';
import { HeroStats } from './_components/HeroStats/HeroStats';

import classes from './HeroSection.module.scss';

export const HeroSection: FC = () => (
  <section className={classes.hero}>
    <div className={classes.container}>
      <div className={classes.content}>
        <p className={classes.overline}>{'Авторская флористика'}</p>

        <h1 className={classes.title}>{'Букеты, которые говорят за вас'}</h1>

        <p className={classes.subtitle}>
          {'Редкие и экзотические цветы, необычные сочетания, индивидуальный подход и внимание к каждой детали. Стильная флористика по честной цене.'}
        </p>

        <HeroActions />
        <HeroStats />
      </div>

      <HeroMedia />
    </div>
  </section>
);
