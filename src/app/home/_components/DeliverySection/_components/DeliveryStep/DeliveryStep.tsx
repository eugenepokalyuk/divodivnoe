import React, { FC } from 'react';

import classes from './DeliveryStep.module.scss';

export interface Step {
  /** Порядковый номер шага: «01», «02». */
  step: string;
  title: string;
  text: string;
}

export const DeliveryStep: FC<Step> = ({ step, title, text }) => (
  <li className={classes.item}>
    <span className={classes.step}>{step}</span>
    <h3 className={classes.title}>{title}</h3>
    <p className={classes.text}>{text}</p>
  </li>
);
