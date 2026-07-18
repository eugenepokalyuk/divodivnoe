'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import clsx from 'clsx';

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui';

import classes from './ProductGallery.module.scss';

interface Props {
  /** Абсолютные ссылки, обложка первой (готовит бэкенд). */
  images: string[];
  /** Название товара — в alt каждого фото, иначе галерея немая для скринридера. */
  alt: string;
  /** Индекс слайда, заданный снаружи (выбор параметра с фото). Галерея
   *  листает на него; при обычном свайпе сама сообщает новый через
   *  onIndexChange. Необязательно — без этого галерея живёт сама по себе. */
  index?: number;
  onIndexChange?: (index: number) => void;
}

/** Галерея товара: крупный слайдер + лента миниатюр под ним.
 *
 *  Два независимых Embla, связанных вручную (штатный паттерн thumbs):
 *  клик по миниатюре листает главный, а листание главного подсвечивает
 *  и подтягивает нужную миниатюру. При одном фото ни стрелок, ни ленты
 *  нет — листать нечего. */
export const ProductGallery: FC<Props> = ({
  images,
  alt,
  index,
  onIndexChange,
}) => {
  const [selected, setSelected] = useState(0);
  const [mainRef, mainApi] = useEmblaCarousel();
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (i: number) => mainApi?.scrollTo(i),
    [mainApi],
  );

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const current = mainApi.selectedScrollSnap();
    setSelected(current);
    thumbApi?.scrollTo(current);
    onIndexChange?.(current);
  }, [mainApi, thumbApi, onIndexChange]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      mainApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [mainApi, onSelect]);

  // Внешний индекс (выбрали параметр с фото) — листаем на него. Проверка
  // на равенство рвёт цикл: свайп → onIndexChange → index → сюда, но снап
  // уже такой, второй раз не листаем.
  useEffect(() => {
    if (!mainApi || index == null) return;
    if (index !== mainApi.selectedScrollSnap()) mainApi.scrollTo(index);
  }, [mainApi, index]);

  // Товар без единого фото: не рисуем пустой слайдер, показываем плашку.
  if (images.length === 0) {
    return (
      <div className={clsx(classes.viewport, classes.empty)} aria-hidden />
    );
  }

  const multiple = images.length > 1;

  return (
    <div className={classes.gallery}>
      <div className={classes.stage}>
        <div className={classes.viewport} ref={mainRef}>
          <div className={classes.track}>
            {images.map((src, index) => (
              <div className={classes.slide} key={src}>
                <Image
                  src={src}
                  alt={`${alt} — фото ${index + 1}`}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className={classes.image}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {multiple && (
          <>
            <button
              type="button"
              className={clsx(classes.arrow, classes.prev)}
              onClick={() => mainApi?.scrollPrev()}
              aria-label="Предыдущее фото"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className={clsx(classes.arrow, classes.next)}
              onClick={() => mainApi?.scrollNext()}
              aria-label="Следующее фото"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {multiple && (
        <div className={classes.thumbs} ref={thumbRef}>
          <div className={classes.thumbsTrack}>
            {images.map((src, index) => (
              <button
                type="button"
                key={src}
                onClick={() => onThumbClick(index)}
                className={clsx(
                  classes.thumb,
                  index === selected && classes.thumbActive,
                )}
                aria-label={`Показать фото ${index + 1}`}
                aria-current={index === selected}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className={classes.thumbImage}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
