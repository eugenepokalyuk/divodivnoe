import React, {FC} from 'react';

import {Section} from '@/components/ui';

import {CatalogCard, Collection} from './_components/CatalogCard/CatalogCard';

import classes from './CatalogSection.module.scss';

/** Рыба под каталог: заменить на данные с бэкенда/CMS, когда появятся. */
const COLLECTIONS:Collection[] = [
    {
        title: 'Авторские букеты',
        price: 'от 3 500 ₽',
        note: 'Хит',
        image: '/photos/catalog/avtorskie-bukety.webp',
    },
    {
        title: 'Пионы',
        price: 'от 4 900 ₽',
        note: 'Сезон',
        image: '/photos/catalog/piony.webp',
    },
    {
        title: 'Моно-букеты',
        price: 'от 2 400 ₽',
        image: '/photos/catalog/mono-bukety.webp',
    },
    {
        title: 'Композиции в коробке',
        price: 'от 5 200 ₽',
        image: '/photos/catalog/kompozicii-v-korobke.webp',
    },
    {
        title: 'Свадебная флористика',
        price: 'от 8 000 ₽',
        image: '/photos/catalog/svadebnaya-floristika.webp',
    },
    {
        title: 'Цветы в вазе',
        price: 'от 6 500 ₽',
        note: 'Новинка',
        image: '/photos/catalog/cvety-v-vaze.webp',
    },
];

export const CatalogSection:FC = () => (
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
