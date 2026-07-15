import React, { FC } from 'react';

import { ExternalLink, Logo } from '@/components/ui';
import {
  CompanyAddressFull,
  CompanyCity,
  Contacts,
  WorkingHours,
} from '@/utils/consts';

import classes from './FooterBrand.module.scss';

export const FooterBrand: FC = () => (
  <div className={classes.brand}>
    <Logo size="medium" />

    <p className={classes.tagline}>
      Авторская флористика и доставка букетов по {CompanyCity}у. {WorkingHours}.
    </p>

    <ExternalLink href={Contacts.Map} className={classes.address}>
      {CompanyAddressFull}
    </ExternalLink>
  </div>
);
