import React, { FC } from 'react';

import { Logo } from '@/components/ui';
import { Routes } from '@/utils/consts';

import { HeaderActions } from './HeaderActions/HeaderActions';
import { HeaderNav } from './HeaderNav/HeaderNav';

import classes from './Header.module.scss';

export const Header: FC = () => (
  <header className={classes.header}>
    <div className={classes.container}>
      <Logo href={Routes.Home} />
      <HeaderNav />
      <HeaderActions />
    </div>
  </header>
);
