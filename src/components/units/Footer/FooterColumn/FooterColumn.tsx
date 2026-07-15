import React, { FC, PropsWithChildren } from 'react';

import classes from './FooterColumn.module.scss';

interface Props extends PropsWithChildren {
  title: string;
}

/** Колонка футера: заголовок капсом + столбик ссылок. */
export const FooterColumn: FC<Props> = ({ title, children }) => (
  <div className={classes.column}>
    <p className={classes.title}>{title}</p>
    {children}
  </div>
);
