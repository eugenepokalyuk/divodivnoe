import React, { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { ChevronLeftIcon } from '../Icons/Icons';

import classes from './BackLink.module.scss';

interface Props {
  /** Куда ведёт «назад» — родительский уровень вложенности, а не history.
   *  Явный адрес надёжнее router.back(): работает и когда на страницу
   *  пришли по прямой ссылке из мессенджера, а истории перехода нет. */
  href: string;
  /** Подпись — обычно «В каталог» / «Назад к коллекции». */
  children: React.ReactNode;
  className?: string;
}

export const BackLink: FC<Props> = ({ href, children, className }) => (
  <Link href={href} className={clsx(classes.back, className)}>
    <ChevronLeftIcon />
    <span>{children}</span>
  </Link>
);
