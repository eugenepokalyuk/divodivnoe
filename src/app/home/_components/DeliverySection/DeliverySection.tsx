import React, { FC } from 'react';

import { Section } from '@/components/ui';
import { CompanyCity, WorkingHours } from '@/utils/consts';

import { DeliveryStep, Step } from './_components/DeliveryStep/DeliveryStep';

import classes from './DeliverySection.module.scss';

const STEPS: Step[] = [
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
    text: `По ${CompanyCity}у — от 2 часов. Стоимость считаем индивидуально: зависит от района и удалённости. От 5 000 ₽ дарим транспортировочный набор — коробку и аквабокс.`,
  },
];

export const DeliverySection: FC = () => (
  <Section
    id="delivery"
    overline="Доставка и оплата"
    title="Как мы работаем"
    description={`${WorkingHours}. Срочный заказ соберём за час — напишите, согласуем.`}
  >
    <ol className={classes.steps}>
      {STEPS.map((step) => (
        <DeliveryStep key={step.step} {...step} />
      ))}
    </ol>
  </Section>
);
