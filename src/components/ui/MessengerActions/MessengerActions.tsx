import React, { FC } from 'react';
import clsx from 'clsx';

import { Messenger, MessengerOrder, Messengers } from '@/utils/consts';
import { buildMessengerLink } from '@/utils/helpers';

import classes from './MessengerActions.module.scss';
import { Button } from '../Button/Button';

interface Props {
  /** Текст, который подставится в чат. MAX его игнорирует — не умеет. */
  message?: string;
  /** Своя логика ссылки (например, у акции — свой менеджер в телеграме). */
  getHref?: (messenger: Messenger) => string;
  size?: 'small' | 'medium';
  className?: string;
}

/** Кнопки «написать» одним блоком. Порядок задан MessengerOrder и одинаков
 *  на всех экранах — так пользователь запоминает, где что. */
export const MessengerActions: FC<Props> = ({
  message,
  getHref,
  size = 'small',
  className,
}) => (
  <div className={clsx(classes.actions, className)}>
    {MessengerOrder.map((messenger, index) => (
      <Button
        key={messenger}
        href={
          getHref ? getHref(messenger) : buildMessengerLink(messenger, message)
        }
        external
        size={size}
        variant={index === 0 ? 'filled' : 'outlined'}
        className={classes.button}
      >
        {Messengers[messenger].label}
      </Button>
    ))}
  </div>
);
