import React, { FC } from 'react';

import { Button, MessengerActions } from '@/components/ui';
import { Contacts, PhoneDisplay } from '@/utils/consts';

import classes from './HeaderActions.module.scss';

export const HeaderActions: FC = () => (
  <div className={classes.actions}>
    <a href={Contacts.Phone} className={classes.phone}>
      {PhoneDisplay}
    </a>

    {/* На мобиле шапка держит одно действие — позвонить.
        Мессенджеры там не дублируем: они в герое и на карточках акций,
        иначе три одинаковые кнопки съедают полэкрана до контента. */}
    <Button
      href={Contacts.Phone}
      external
      size="small"
      variant="outlined"
      className={classes.call}
    >
      Позвонить
    </Button>

    <MessengerActions className={classes.messengers} />
  </div>
);
