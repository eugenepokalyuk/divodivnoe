import React, { FC } from 'react';

import { LegalDocs } from '@/utils/consts';

import { FooterColumn } from '../FooterColumn/FooterColumn';
import { FooterLink } from '../FooterLink/FooterLink';

/** Столбец футера с правовыми документами (152-ФЗ, оферта). */
export const FooterDocs: FC = () => (
  <FooterColumn title="Документы">
    {LegalDocs.map(({ href, label }) => (
      <FooterLink key={href} href={href}>
        {label}
      </FooterLink>
    ))}
  </FooterColumn>
);
