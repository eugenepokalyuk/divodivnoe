'use client';

import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { CloseIcon, MenuIcon } from '@/components/ui';
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

import classes from './MobileMenu.module.scss';

/** Бургер-меню (ниже lg). Кнопка стоит справа от «Позвонить» в HeaderActions,
 *  панель выезжает справа и разворачивает всё меню целиком: обычные ссылки,
 *  группу «Услуги» и контакты. Десктопные дропдауны на узком экране неудобны,
 *  поэтому здесь всё раскрыто списком. */
export const MobileMenu: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const isVisible = useNavVisibility();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Смена маршрута — закрываем панель (клик по обычной ссылке). Хеш-ссылки
  // (#about) pathname не меняют, их гасит onClick на самих ссылках.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={classes.burger}
        aria-label="Открыть меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className={classes.overlay}
                onClick={close}
                role="presentation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.nav
                  className={classes.drawer}
                  aria-label="Меню"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    className={classes.close}
                    aria-label="Закрыть меню"
                    onClick={close}
                  >
                    <CloseIcon />
                  </button>

                  <div className={classes.list}>
                    {HeaderMenu.map((entry) => {
                      if (entry.type === 'link') {
                        if (!isVisible(entry.item)) return null;
                        return (
                          <Link
                            key={entry.item.href}
                            href={entry.item.href}
                            className={classes.link}
                            onClick={close}
                          >
                            {entry.item.label}
                          </Link>
                        );
                      }

                      if (entry.type === 'group') {
                        return (
                          <div key={entry.label} className={classes.group}>
                            <span className={classes.groupTitle}>
                              {entry.label}
                            </span>
                            {entry.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={classes.sublink}
                                onClick={close}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        );
                      }

                      // Контакты — телефон, мессенджеры, адрес и часы.
                      return (
                        <div key={entry.label} className={classes.group}>
                          <span className={classes.groupTitle}>
                            {entry.label}
                          </span>

                          <a href={Contacts.Phone} className={classes.sublink}>
                            {PhoneDisplay}
                          </a>

                          {MessengerOrder.map((messenger) => (
                            <a
                              key={messenger}
                              href={Messengers[messenger].link}
                              className={classes.sublink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {Messengers[messenger].label}
                            </a>
                          ))}

                          <a
                            href={Company2gis}
                            className={classes.sublink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {CompanyAddress}
                          </a>

                          <span className={classes.hours}>{WorkingHours}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
