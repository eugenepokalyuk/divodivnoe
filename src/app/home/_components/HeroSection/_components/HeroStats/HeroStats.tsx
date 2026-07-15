import React, { FC } from 'react';

import classes from './HeroStats.module.scss';

interface Stat {
  value: string;
  label: string;
}

/** Только проверяемые факты, никаких обещаний срока: «7 дней свежести»
 *  клиент читает как гарантию и приходит с ней спорить, когда букет
 *  поник на пятый день. Цифры дублируют «О нас» и секцию доставки —
 *  меняя здесь, поправьте и там.
 *
 *  Третьим пунктом сюда встанет рейтинг 2ГИС — ждём реальную оценку
 *  с карточки, выдуманную ставить нельзя. */
const STATS: Stat[] = [
  { value: '2 часа', label: 'от заказа до доставки' },
  { value: '2 раза', label: 'в неделю привозим свежий срез' },
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
