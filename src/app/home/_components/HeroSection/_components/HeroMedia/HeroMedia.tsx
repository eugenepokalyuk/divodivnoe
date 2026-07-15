import React, { FC } from 'react';

import classes from './HeroMedia.module.scss';

/** Плейсхолдер под съёмку — заменить на <Image> с фото букета. */
export const HeroMedia: FC = () => (
  <div className={classes.media} aria-hidden="true">
    <span className={classes.hint}>Фото букета</span>
  </div>
);
