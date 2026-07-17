'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import { NavItems } from '@/utils/consts';

import { useVisibleNavItems } from '../../useNavItems';

import classes from './HeaderNav.module.scss';

export const HeaderNav: FC = () => {
  const items = useVisibleNavItems(NavItems);

  return (
    <nav className={classes.nav}>
      {items.map(({ href, label }) => (
        <Link key={href} href={href} className={classes.link}>
          {label}
        </Link>
      ))}
    </nav>
  );
};
