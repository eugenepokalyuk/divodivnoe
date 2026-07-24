'use client';

import React, { FC } from 'react';
import Link from 'next/link';

import {
  Company2gis,
  CompanyAddress,
  Contacts,
  HeaderMenu,
  Messengers,
  MessengerOrder,
  PhoneDisplay,
  WorkingHours,
} from '@/utils/consts';

import { useNavVisibility } from '../../useNavItems';
import { NavDropdown } from './NavDropdown';

import classes from './HeaderNav.module.scss';
import dropdown from './NavDropdown.module.scss';

/** Десктопная навигация (от lg и шире). Ниже lg скрыта — там бургер-меню
 *  в HeaderActions. Часть пунктов — обычные ссылки, «Услуги» и «Контакты»
 *  свёрнуты в дропдауны, чтобы длинное меню помещалось в одну строку. */
export const HeaderNav: FC = () => {
  const isVisible = useNavVisibility();

  return (
    <nav className={classes.nav}>
      {HeaderMenu.map((entry) => {
        if (entry.type === 'link') {
          if (!isVisible(entry.item)) return null;
          return (
            <Link
              key={entry.item.href}
              href={entry.item.href}
              className={classes.link}
            >
              {entry.item.label}
            </Link>
          );
        }

        if (entry.type === 'group') {
          return (
            <NavDropdown key={entry.label} label={entry.label}>
              <div className={dropdown.card}>
                {entry.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={dropdown.item}
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </NavDropdown>
          );
        }

        // entry.type === 'contacts' — телефон, мессенджеры и адрес в одной
        // панели, чтобы не дублировать их отдельными кнопками в шапке.
        return (
          <NavDropdown key={entry.label} label={entry.label}>
            <div className={dropdown.card}>
              <a href={Contacts.Phone} className={dropdown.item} role="menuitem">
                {PhoneDisplay}
              </a>

              {MessengerOrder.map((messenger) => (
                <a
                  key={messenger}
                  href={Messengers[messenger].link}
                  className={dropdown.item}
                  role="menuitem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Messengers[messenger].label}
                </a>
              ))}

              <a
                href={Company2gis}
                className={dropdown.item}
                role="menuitem"
                target="_blank"
                rel="noopener noreferrer"
              >
                {CompanyAddress}
              </a>

              <span className={classes.hours}>{WorkingHours}</span>
            </div>
          </NavDropdown>
        );
      })}
    </nav>
  );
};
