import React, {FC} from 'react';

import classes from './AboutSection.module.scss';
import {AboutFeature, Feature} from './_components/AboutFeature/AboutFeature';
import {AboutIntro} from './_components/AboutIntro/AboutIntro';

const FEATURES:Feature[] = [
    {
        title: 'Экзотические цветы',
        text: 'Мы регулярно привозим редкие и экзотические цветы, чтобы создавать необычные авторские композиции.',
    }, {
        title: 'Свежий ассортимент',
        text: 'Получаем свежие поставки несколько раз в неделю и тщательно отбираем каждый цветок.',
    }, {
        title: 'Авторская сборка',
        text: 'Собираем каждый букет в нашем фирменном стиле с учетом вашего пожелания, настроения и бюджета.',
    }, {
        title: 'Фото перед доставкой',
        text: 'Перед отправкой пришлем фото готового букета, чтобы вы были уверены в результате.',
    },
];

export const AboutSection:FC = () => (
    <section id="about" className={classes.about}>
        <div className={classes.container}>
            <AboutIntro/>

            <ul className={classes.features}>
                {FEATURES.map((feature) => (
                    <AboutFeature key={feature.title} {...feature} />
                ))}
            </ul>
        </div>
    </section>
);
