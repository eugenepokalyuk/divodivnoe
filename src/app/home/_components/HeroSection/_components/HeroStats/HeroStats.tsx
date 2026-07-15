import React, { FC } from 'react';

import classes from './HeroStats.module.scss';

interface Stat {
  value: string;
  label: string;
}

/** Рыба: цифры не подтверждены — проверить перед продом. */
const STATS: Stat[] = [
  { value: '2 часа', label: 'от заказа до доставки' },
  { value: '7 дней', label: 'свежесть букета' },
  { value: '5 лет', label: 'собираем букеты' },
];

export const HeroStats: FC = () => (
  <ul className={classes.stats}>
    {STATS.map(({ value, label }) => (
      <li key={label} className={classes.stat}>
        <span className={classes.value}>{value}</span>
        <span className={classes.label}>{label}</span>
      </li>
    ))}
  </ul>
);
