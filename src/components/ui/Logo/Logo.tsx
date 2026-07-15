import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { CompanyName, Routes } from '@/utils/consts';

import classes from './Logo.module.scss';

interface Props {
  /** Со ссылкой — в шапке; без неё — в футере, где вести уже некуда. */
  href?: string;
  size?: 'small' | 'medium';
  className?: string;
}

/** Название фирменным шрифтом Yauza TYGRA. Живёт в одном месте,
 *  чтобы шрифт и начертание не разъезжались между шапкой и футером. */
export const Logo: FC<Props> = ({ href, size = 'small', className }) => {
  const cx = clsx(classes.logo, classes[size], className);

  if (href) {
    return (
      <Link href={href ?? Routes.Home} className={cx}>
        {CompanyName}
      </Link>
    );
  }

  return <p className={cx}>{CompanyName}</p>;
};
