import React, { FC } from 'react';

import { FooterBottom } from './FooterBottom/FooterBottom';
import { FooterBrand } from './FooterBrand/FooterBrand';
import { FooterContacts } from './FooterContacts/FooterContacts';
import { FooterNav } from './FooterNav/FooterNav';

import classes from './Footer.module.scss';

export const Footer: FC = () => (
  <footer id="contacts" className={classes.footer}>
    <div className={classes.container}>
      <FooterBrand />
      <FooterNav />
      <FooterContacts />
    </div>

    <FooterBottom />
  </footer>
);
