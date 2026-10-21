import React, { FC } from 'react';

import { Section } from '@/components/ui';

import classes from './BusinessSteps.module.scss';

const steps = [
  {
    title: 'Свяжитесь с нами',
    text: 'Оставьте заявку на сайте или напишите нам в любой удобный мессенджер',
  },
  {
    title: 'Обсуждаем задачи',
    text: 'Наш менеджер свяжется с вами, чтобы уточнить детали',
  },
  {
    title: 'Получите предложение',
    text: 'Мы подготовим для вас индивидуальное коммерческое предложение с условиями и ценами',
  },
  {
    title: 'Заключаем договор',
    text: 'Подписываем договор и начинаем наше цветочное партнёрство!',
  },
  {
    title: 'Согласовываем с вами перед доставкой',
    text: 'Отправим фото цветов, ваз и дополнительных элементов для составления цветочных композиций',
  },
];

export const BusinessSteps: FC = () => (
  <Section title="Как начать наше сотрудничество?">
    <ol className={classes.list}>
      {steps.map(({ title, text }, index) => (
        <li key={title} className={classes.step}>
          <span className={classes.number}>{index + 1}</span>
          <div className={classes.body}>
            <h3 className={classes.title}>{title}</h3>
            <p className={classes.text}>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>
);
