import React, { FC } from 'react';

import { FooterNavItems } from '@/utils/consts';

import { FooterColumn } from '../FooterColumn/FooterColumn';
import { FooterLink } from '../FooterLink/FooterLink';

export const FooterNav: FC = () => (
  <FooterColumn title="Меню">
    {FooterNavItems.map(({ href, label, fullLabel }) => (
      <FooterLink key={href} href={href}>
        {fullLabel ?? label}
      </FooterLink>
    ))}
  </FooterColumn>
);
