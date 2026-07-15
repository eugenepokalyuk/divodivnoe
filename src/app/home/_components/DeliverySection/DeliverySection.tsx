import React, { FC } from 'react';

import { Section } from '@/components/ui';

import classes from './DeliverySection.module.scss';

const STEPS = [
  {
    step: '01',
    title: 'Выбираете букет',
    text: 'В каталоге или вместе с флористом в мессенджере — подскажем и покажем варианты.',
  },
  {
    step: '02',
    title: 'Подтверждаем детали',
    text: 'Дата, время, адрес и открытка. Оплата картой по ссылке или переводом.',
  },
  {
    step: '03',
    title: 'Собираем и показываем',
    text: 'Присылаем фото готового букета до отправки курьеру.',
  },
  {
    step: '04',
    title: 'Доставляем',
    text: 'По городу — от 2 часов, 400 ₽. От 5 000 ₽ доставка бесплатная.',
  },
];

export const DeliverySection: FC = () => (
  <Section
    id="delivery"
    overline="Доставка и оплата"
    title="Как мы работаем"
    description="Ежедневно с 8:00 до 22:00. Срочный заказ соберём за час — напишите, согласуем."
  >
    <ol className={classes.steps}>
      {STEPS.map(({ step, title, text }) => (
        <li key={step} className={classes.item}>
          <span className={classes.step}>{step}</span>
          <h3 className={classes.title}>{title}</h3>
          <p className={classes.text}>{text}</p>
        </li>
      ))}
    </ol>
  </Section>
);
