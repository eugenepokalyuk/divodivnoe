import React, { FC, PropsWithChildren } from 'react';

import { CartFab } from '../CartFab/CartFab';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

import classes from './Layout.module.scss';

export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <div className={classes.layout}>
    <Header />
    <main className={classes.main}>{children}</main>
    <Footer />
    <CartFab />
  </div>
);
