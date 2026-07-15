import React, { FC } from 'react';

import { CompanyName } from '@/utils/consts';

import classes from './FooterBottom.module.scss';

export const FooterBottom: FC = () => (
  <div className={classes.bottom}>
    <p className={classes.copyright}>
      © {new Date().getFullYear()} {CompanyName}
    </p>
  </div>
);
