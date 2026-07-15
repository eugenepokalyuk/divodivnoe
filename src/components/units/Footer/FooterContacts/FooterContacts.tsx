import React, { FC } from 'react';

import {
  CompanyEmail,
  Contacts,
  MessengerOrder,
  Messengers,
  PhoneDisplay,
} from '@/utils/consts';

import { FooterColumn } from '../FooterColumn/FooterColumn';
import { FooterLink } from '../FooterLink/FooterLink';

export const FooterContacts: FC = () => (
  <FooterColumn title="Контакты">
    <FooterLink href={Contacts.Phone}>{PhoneDisplay}</FooterLink>

    {MessengerOrder.map((messenger) => (
      <FooterLink key={messenger} href={Messengers[messenger].link} external>
        {Messengers[messenger].label}
      </FooterLink>
    ))}

    <FooterLink href={Contacts.Vk} external>
      ВКонтакте
    </FooterLink>

    <FooterLink href={Contacts.Email}>{CompanyEmail}</FooterLink>
  </FooterColumn>
);
