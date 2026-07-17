'use client';

import React, { FC } from 'react';

import { FooterNavItems } from '@/utils/consts';

import { useVisibleNavItems } from '../../useNavItems';
import { FooterColumn } from '../FooterColumn/FooterColumn';
import { FooterLink } from '../FooterLink/FooterLink';

export const FooterNav: FC = () => {
  const items = useVisibleNavItems(FooterNavItems);

  return (
    <FooterColumn title="Меню">
      {items.map(({ href, label, fullLabel }) => (
        <FooterLink key={href} href={href}>
          {fullLabel ?? label}
        </FooterLink>
      ))}
    </FooterColumn>
  );
};
