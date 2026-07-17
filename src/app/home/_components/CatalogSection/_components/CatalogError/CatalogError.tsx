import React, { FC } from 'react';

import { MessengerActions } from '@/components/ui';

import classes from './CatalogError.module.scss';

/** Каталог не приехал: сервер лёг, у клиента отвалилась сеть, блокировщик
 *  срезал запрос. Технические подробности посетителю бесполезны, поэтому
 *  вместо ошибки даём то, зачем он пришёл, — способ написать флористу. */
export const CatalogError: FC = () => (
  <div className={classes.error} role="status">
    <p className={classes.text}>
      Не получилось загрузить каталог. Напишите нам — флорист подберёт букет под
      ваш повод и пришлёт фото.
    </p>

    <MessengerActions
      message={`Здравствуйте! Я с сайта divodivnoe.com, хочу собрать букет`}
      className={classes.actions}
    />
  </div>
);
