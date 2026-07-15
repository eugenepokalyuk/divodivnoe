import React, { FC } from 'react';

import { AboutFeature, Feature } from './_components/AboutFeature/AboutFeature';
import { AboutIntro } from './_components/AboutIntro/AboutIntro';

import classes from './AboutSection.module.scss';

const FEATURES: Feature[] = [
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
      <AboutIntro />

      <ul className={classes.features}>
        {FEATURES.map((feature) => (
          <AboutFeature key={feature.title} {...feature} />
        ))}
      </ul>
    </div>
  </section>
);
