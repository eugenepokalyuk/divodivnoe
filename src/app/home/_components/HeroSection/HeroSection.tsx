import React, { FC } from 'react';

import { Button } from '@/components/ui';
import { Contacts, Routes } from '@/utils/consts';

import classes from './HeroSection.module.scss';

const STATS = [
  { value: '2 часа', label: 'от заказа до доставки' },
  { value: '7 дней', label: 'свежесть букета' },
  { value: '5 лет', label: 'собираем букеты' },
];

export const HeroSection: FC = () => (
  <section className={classes.hero}>
    <div className={classes.container}>
      <div className={classes.content}>
        <p className={classes.overline}>Авторская флористика</p>

        <h1 className={classes.title}>
          Букеты, которые говорят за вас
        </h1>

        <p className={classes.subtitle}>
          Собираем композиции из свежих цветов под ваш повод и настроение.
          Доставим по городу в день заказа — бережно и вовремя.
        </p>

        <div className={classes.actions}>
          <Button href={Routes.Catalog}>Смотреть каталог</Button>

          <div className={classes.messengers}>
            <Button href={Contacts.Telegram} external variant="outlined">
              Написать в Telegram
            </Button>
            <Button href={Contacts.Max} external variant="outlined">
              Написать в MAX
            </Button>
          </div>
        </div>

        <ul className={classes.stats}>
          {STATS.map(({ value, label }) => (
            <li key={label} className={classes.stat}>
              <span className={classes.stat_value}>{value}</span>
              <span className={classes.stat_label}>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Плейсхолдер под съёмку — заменить на <Image> с фото букета. */}
      <div className={classes.media} aria-hidden="true">
        <span className={classes.media_hint}>Фото букета</span>
      </div>
    </div>
  </section>
);
