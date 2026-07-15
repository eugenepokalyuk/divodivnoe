import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './Section.module.scss';

interface Props extends PropsWithChildren {
  id?: string;
  /** Надзаголовок мелким капсом над основным заголовком. */
  overline?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const Section: FC<Props> = ({
  id,
  overline,
  title,
  description,
  className,
  children,
}) => (
  <section id={id} className={clsx(classes.section, className)}>
    <div className={classes.container}>
      {(overline || title || description) && (
        <header className={classes.header}>
          {overline && <p className={classes.overline}>{overline}</p>}
          {title && <h2 className={classes.title}>{title}</h2>}
          {description && <p className={classes.description}>{description}</p>}
        </header>
      )}

      {children}
    </div>
  </section>
);
