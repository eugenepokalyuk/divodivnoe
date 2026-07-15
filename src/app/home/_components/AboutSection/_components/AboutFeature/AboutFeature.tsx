import React, { FC } from 'react';

import classes from './AboutFeature.module.scss';

export interface Feature {
  title: string;
  text: string;
}

export const AboutFeature: FC<Feature> = ({ title, text }) => (
  <li className={classes.feature}>
    <h3 className={classes.title}>{title}</h3>
    <p className={classes.text}>{text}</p>
  </li>
);
