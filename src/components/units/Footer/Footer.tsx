import React, { FC } from 'react';
import Link from 'next/link';

import {
  CompanyEmail,
  CompanyName,
  Contacts,
  PhoneDisplay,
  Routes,
} from '@/utils/consts';

import classes from './Footer.module.scss';

export const Footer: FC = () => (
  <footer id="contacts" className={classes.footer}>
    <div className={classes.container}>
      <div className={classes.brand}>
        <p className={classes.logo}>{CompanyName}</p>
        <p className={classes.tagline}>
          Авторская флористика и доставка букетов по городу — каждый день
          с 8:00 до 22:00.
        </p>
      </div>

      <div className={classes.column}>
        <p className={classes.column_title}>Меню</p>
        <Link href={Routes.Catalog} className={classes.link}>
          Каталог
        </Link>
        <Link href={Routes.Promotions} className={classes.link}>
          Акции
        </Link>
        <Link href={Routes.About} className={classes.link}>
          О нас
        </Link>
        <Link href={Routes.Delivery} className={classes.link}>
          Доставка и оплата
        </Link>
      </div>

      <div className={classes.column}>
        <p className={classes.column_title}>Контакты</p>
        <a href={Contacts.Phone} className={classes.link}>
          {PhoneDisplay}
        </a>
        <a
          href={Contacts.Telegram}
          className={classes.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram
        </a>
        <a
          href={Contacts.Max}
          className={classes.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          MAX
        </a>
        <a href={Contacts.Email} className={classes.link}>
          {CompanyEmail}
        </a>
      </div>
    </div>

    <div className={classes.bottom}>
      <p className={classes.copyright}>
        © {new Date().getFullYear()} {CompanyName}
      </p>
    </div>
  </footer>
);
