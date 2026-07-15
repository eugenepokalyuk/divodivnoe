import React, { CSSProperties, FC } from 'react';
import clsx from 'clsx';

import classes from './Skeleton.module.scss';

interface Props {
  /** Любое валидное CSS-значение: '100%', '120px', '8ch'. */
  width?: string;
  height?: string;
  /** Скругление под конкретное место: у карточки одно, у строки текста другое. */
  radius?: string;
  className?: string;
}

/** Серая плашка с бликом на месте контента, который ещё едет.
 *
 *  Для скринридера невидима: озвучивать «загрузка» на каждый прямоугольник
 *  бессмысленно, о состоянии сообщает контейнер через aria-busy. */
export const Skeleton: FC<Props> = ({
  width = '100%',
  height = '1em',
  radius,
  className,
}) => (
  <span
    aria-hidden="true"
    className={clsx(classes.skeleton, className)}
    style={{ width, height, borderRadius: radius } as CSSProperties}
  />
);
