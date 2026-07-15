import React, { FC } from 'react';
import Link from 'next/link';

import { NavItems } from '@/utils/consts';

import classes from './HeaderNav.module.scss';

export const HeaderNav: FC = () => (
  <nav className={classes.nav}>
    {NavItems.map(({ href, label }) => (
      <Link key={href} href={href} className={classes.link}>
        {label}
      </Link>
    ))}
  </nav>
);
