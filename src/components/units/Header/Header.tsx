import React, { FC } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { CompanyName, Contacts, PhoneDisplay, Routes } from '@/utils/consts';

import classes from './Header.module.scss';

const NAV_ITEMS = [
  { href: Routes.Catalog, label: 'Каталог' },
  { href: Routes.Promotions, label: 'Акции' },
  { href: Routes.About, label: 'О нас' },
  { href: Routes.Delivery, label: 'Доставка' },
  { href: Routes.Contacts, label: 'Контакты' },
];

export const Header: FC = () => (
  <header className={classes.header}>
    <div className={classes.container}>
      <Link href={Routes.Home} className={classes.logo}>
        {CompanyName}
      </Link>

      <nav className={classes.nav}>
        {NAV_ITEMS.map(({ href, label }) => (
          <Link key={href} href={href} className={classes.nav_link}>
            {label}
          </Link>
        ))}
      </nav>

      <div className={classes.actions}>
        <a href={Contacts.Phone} className={classes.phone}>
          {PhoneDisplay}
        </a>

        <Button href={Contacts.Telegram} external size="small">
          Telegram
        </Button>

        <Button href={Contacts.Max} external size="small" variant="outlined">
          MAX
        </Button>
      </div>
    </div>
  </header>
);
