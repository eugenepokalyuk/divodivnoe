import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import classes from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'default' | 'primary';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  href?: string;
  /** Внешняя ссылка — рендерим <a> вместо next/link, открываем в новой вкладке. */
  external?: boolean;
}

export const Button: FC<Props> = ({
  size = 'medium',
  color = 'default',
  variant = 'filled',
  className,
  fullWidth,
  children,
  href,
  external,
  ...rest
}) => {
  const cx = clsx(
    classes.button,
    classes[color],
    classes[size],
    variant !== 'filled' && classes[variant],
    className,
    { [classes.full_width]: fullWidth },
  );

  if (href && external) {
    return (
      <a href={href} className={cx} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={cx}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" {...rest} className={cx}>
      {children}
    </button>
  );
};
