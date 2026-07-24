import React, {FC} from 'react';

import {CompanyName} from '@/utils/consts';

import classes from './AboutIntro.module.scss';

export const AboutIntro:FC = () => (
    <div className={classes.intro}>
        <p className={classes.overline}>{'О нас'}</p>

        <h2 className={classes.title}>
            {'Цветы — это способ сказать то, что сложно словами'}
        </h2>

        <p className={classes.text}>
            «{CompanyName}» — мастерская авторской флористики, где каждый букет создается с учетом ваших пожеланий,
            повода и настроения. Мы работаем с сезонными, редкими и экзотическими цветами, создавая композиции, которые
            запоминаются и вызывают эмоции. Красиво, индивидуально и по честной цене.
        </p>
    </div>
);
