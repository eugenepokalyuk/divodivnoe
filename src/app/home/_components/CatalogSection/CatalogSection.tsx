import React, { FC } from 'react';

import { Section } from '@/components/ui';
import { Routes } from '@/utils/consts';

import classes from './CatalogSection.module.scss';

/** Рыба под каталог: заменить на данные с бэкенда/CMS, когда появятся. */
const COLLECTIONS = [
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
      {COLLECTIONS.map(({ title, price, note }) => (
        <li key={title}>
          <a href={Routes.Contacts} className={classes.card}>
            {/* Плейсхолдер под фото коллекции. */}
            <span className={classes.media} aria-hidden="true">
              {note && <span className={classes.note}>{note}</span>}
            </span>

            <span className={classes.body}>
              <span className={classes.title}>{title}</span>
              <span className={classes.price}>{price}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  </Section>
);
