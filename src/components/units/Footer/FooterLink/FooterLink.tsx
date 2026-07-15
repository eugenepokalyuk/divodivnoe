import React, { FC, PropsWithChildren } from 'react';
import Link from 'next/link';

import { ExternalLink } from '@/components/ui';

import classes from './FooterLink.module.scss';

interface Props extends PropsWithChildren {
  href: string;
  /** Внешние (мессенджеры, карта) уходят в новую вкладку. */
  external?: boolean;
}

/** Ссылка футера. Сама выбирает тег по адресу: tel:/mailto: — обычный <a>
 *  (это не маршруты, next/link им не нужен), внешние — с target/rel,
 *  остальные — через next/link, который подставит basePath. */
export const FooterLink: FC<Props> = ({ href, external, children }) => {
  if (external) {
    return (
      <ExternalLink href={href} className={classes.link}>
        {children}
      </ExternalLink>
    );
  }

  const isProtocolLink = /^(tel:|mailto:)/.test(href);

  if (isProtocolLink) {
    return (
      <a href={href} className={classes.link}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes.link}>
      {children}
    </Link>
  );
};
