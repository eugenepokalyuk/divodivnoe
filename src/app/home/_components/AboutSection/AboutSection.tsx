import React, { FC } from 'react';

import classes from './AboutSection.module.scss';

const FEATURES = [
  {
    title: 'Свежий срез',
    text: 'Забираем цветы у поставщиков дважды в неделю и не держим их на витрине дольше трёх дней.',
  },
  {
    title: 'Ручная сборка',
    text: 'Каждый букет собирает флорист — под повод, палитру и характер того, кому он предназначен.',
  },
  {
    title: 'Фото перед отправкой',
    text: 'Присылаем снимок готового букета в мессенджер: если что-то не так — переберём.',
  },
];

export const AboutSection: FC = () => (
  <section id="about" className={classes.about}>
    <div className={classes.container}>
      <div className={classes.intro}>
        <p className={classes.overline}>О нас</p>
        <h2 className={classes.title}>
          Цветы — это способ сказать то, что сложно словами
        </h2>
        <p className={classes.text}>
          «Диводивное» — небольшая мастерская авторской флористики. Мы не
          собираем букеты по шаблону: спрашиваем про повод, про человека, про
          то, какое чувство нужно передать — и складываем это в цветы.
        </p>
      </div>

      <ul className={classes.features}>
        {FEATURES.map(({ title, text }) => (
          <li key={title} className={classes.feature}>
            <h3 className={classes.feature_title}>{title}</h3>
            <p className={classes.feature_text}>{text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
