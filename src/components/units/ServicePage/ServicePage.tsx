import React, { FC } from 'react';

import { BackLink, MessengerActions, Section } from '@/components/ui';
import { CompanyDomain, Routes } from '@/utils/consts';

import classes from './ServicePage.module.scss';

export interface ServiceBlock {
  heading: string;
  text: string;
}

interface Props {
  /** Заголовок раздела: «Цветочная подписка» и т.п. */
  title: string;
  /** Вводный абзац под заголовком. */
  lead: string;
  /** Смысловые блоки: как устроено, кому подойдёт, форматы.
   *  Наполнение раздела — за контент-менеджером, структура готова. */
  blocks: ServiceBlock[];
  /** Подставляется в предзаполненное сообщение флористу. */
  inquiry: string;
}

const greeting = `Здравствуйте! Я с сайта ${CompanyDomain}.`;

/** Общий каркас страниц услуг (Подписка / Свадьба / Бизнес): надзаголовок,
 *  вводка, блоки и единый призыв написать флористу. Тексты приходят из
 *  самих страниц, каркас — здесь, чтобы разделы не разъезжались по виду. */
export const ServicePage: FC<Props> = ({ title, lead, blocks, inquiry }) => (
  <Section
    overline="Услуги"
    title={title}
    description={lead}
    back={<BackLink href={Routes.Home}>На главную</BackLink>}
  >
    <div className={classes.blocks}>
      {blocks.map(({ heading, text }) => (
        <article key={heading} className={classes.block}>
          <h3 className={classes.blockHeading}>{heading}</h3>
          <p className={classes.blockText}>{text}</p>
        </article>
      ))}
    </div>

    <div className={classes.cta}>
      <p className={classes.ctaHint}>Обсудим ваш формат — напишите флористу:</p>
      <MessengerActions
        message={`${greeting} ${inquiry}`}
        className={classes.ctaActions}
      />
    </div>
  </Section>
);
