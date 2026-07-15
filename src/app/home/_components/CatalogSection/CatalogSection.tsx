import React, { FC } from 'react';

import { Section } from '@/components/ui';

import { CatalogCard, Collection } from './_components/CatalogCard/CatalogCard';

import classes from './CatalogSection.module.scss';

/** Рыба под каталог: заменить на данные с бэкенда/CMS, когда появятся. */
const COLLECTIONS: Collection[] = [
  { title: 'Авторские букеты', price: 'от 3 500 ₽', note: 'Хит' },
  { title: 'Пионы', price: 'от 4 900 ₽', note: 'Сезон' },
  { title: 'Моно-букеты', price: 'от 2 400 ₽' },
  { title: 'Композиции в коробке', price: 'от 5 200 ₽' },
  { title: 'Свадебная флористика', price: 'от 8 000 ₽' },
  { title: 'Цветы в вазе', price: 'от 6 500 ₽', note: 'Новинка' },
];

export const CatalogSection: FC = () => (
  <Section
    id="catalog"
    overline="Каталог"
    title="Выберите настроение"
    description="Собираем букеты из свежего среза — привозим цветы дважды в неделю. Каждая композиция собирается вручную под ваш повод."
  >
    <ul className={classes.grid}>
      {COLLECTIONS.map((collection) => (
        <li key={collection.title}>
          <CatalogCard {...collection} />
        </li>
      ))}
    </ul>
  </Section>
);
