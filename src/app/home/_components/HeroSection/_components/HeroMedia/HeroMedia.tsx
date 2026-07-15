import React, { FC } from 'react';
import Image from 'next/image';

import classes from './HeroMedia.module.scss';

export const HeroMedia: FC = () => (
  <div className={classes.media}>
    <Image
      src="/photos/hero.webp"
      alt="Авторский букет из свежих цветов ручной сборки"
      fill
      // Главный кадр первого экрана — грузим сразу, без ленивой загрузки.
      priority
      sizes="(max-width: 1023px) 100vw, 50vw"
      className={classes.image}
    />
  </div>
);
