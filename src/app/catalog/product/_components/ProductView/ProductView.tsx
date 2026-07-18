'use client';

import React, { FC, useEffect, useState } from 'react';

import { AddToCartButton } from '@/components/modules';
import { Goals, reachGoal } from '@/lib/analytics/metrika';
import { Button, MessengerActions, Section } from '@/components/ui';
import { useGetProductQuery } from '@/store/api/shopApi';
import type { ProductDto } from '@/store/api/shopApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  chooseOption,
  defaultOptions,
  reconcileOptions,
  selectLineOf,
  setLineOptions,
  toCartLine,
  unitPrice,
} from '@/store/slices/cart';
import type { CartOption } from '@/store/slices/cart';
import { CompanyDomain, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import { GiftHintModal } from '../GiftHintModal/GiftHintModal';
import { ProductGallery } from '../ProductGallery/ProductGallery';
import { ProductParameters } from '../ProductParameters/ProductParameters';

import classes from './ProductView.module.scss';

/** Страница товара: /catalog/product/<slug>/
 *
 *  slug приходит из пути (страница пререндерится под каждый товар, см.
 *  [slug]/page.tsx). Сами данные всё равно тянем на клиенте: цена и
 *  наличие должны быть живыми, а корзина — интерактивной. Состояний много
 *  и каждое ведёт к флористу. */
export const ProductView: FC<{ slug: string }> = ({ slug }) => {
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(slug, { skip: !slug });

  // Хуки до ранних return — иначе нарушим правила хуков.
  const [hintOpen, setHintOpen] = useState(false);
  // Активный слайд галереи — общий для галереи и параметров: выбор
  // варианта с фото листает слайдер, свайп слайдера обновляет индекс.
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Цель Метрики «просмотр товара» — когда данные подтянулись.
  useEffect(() => {
    if (product) {
      reachGoal(Goals.ViewProduct, {
        slug: product.slug,
        productId: product.id,
      });
    }
  }, [product]);

  if (!slug) {
    return (
      <Fallback
        title="Выберите букет"
        text="Откройте каталог и выберите коллекцию — покажем, что есть."
        action={
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        }
      />
    );
  }

  if (isLoading) {
    return (
      <Section overline="Каталог">
        <div className={classes.layout}>
          <div className={classes.gallerySkeleton} aria-busy="true" />
          <div className={classes.infoSkeleton} aria-hidden />
        </div>
      </Section>
    );
  }

  // 404 — товар скрыли в админке или ссылка устарела. Не поломка.
  const isMissing = isError && (error as { status?: number })?.status === 404;

  if (isMissing) {
    return (
      <Fallback
        title="Такого букета больше нет"
        text="Возможно, он уехал к другому получателю. Загляните в каталог — соберём похожий."
        action={
          <Button href={Routes.Catalog} variant="outlined">
            В каталог
          </Button>
        }
      />
    );
  }

  if (isError || !product) {
    return (
      <Fallback
        title="Не получилось загрузить"
        text="Напишите флористу — подберём букет и пришлём фото до отправки."
        action={<MessengerActions message={greeting} />}
      />
    );
  }

  return (
    <Section overline="Каталог">
      <div className={classes.layout}>
        <div className={classes.gallery}>
          <ProductGallery
            images={product.images}
            alt={product.name}
            index={galleryIndex}
            onIndexChange={setGalleryIndex}
          />
        </div>

        <ProductInfo
          product={product}
          onHint={() => setHintOpen(true)}
          onJumpToImage={(url) => {
            const i = product.images.indexOf(url);
            if (i >= 0) setGalleryIndex(i);
          }}
        />
      </div>

      <GiftHintModal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }}
      />
    </Section>
  );
};

/** Правая колонка: цена, параметры, кнопка.
 *
 *  Отдельным компонентом, потому что здесь живёт состояние выбора, а в
 *  ProductView до загрузки товара его негде держать — там ранние return,
 *  и хук пришлось бы звать до того, как известны сами параметры. */
const ProductInfo: FC<{
  product: ProductDto;
  onHint: () => void;
  /** Перелистнуть галерею на фото по ссылке (выбрали вариант с фото). */
  onJumpToImage: (url: string) => void;
}> = ({ product, onHint, onJumpToImage }) => {
  const dispatch = useAppDispatch();
  const line = useAppSelector(selectLineOf(product.id));

  // Товар в корзине — источник правды корзина: показываем ровно то, что
  // уедет в заказ (и переживёт перезагрузку). Нет в корзине — черновик.
  const [draft, setDraft] = useState<CartOption[]>(() =>
    defaultOptions(product.parameters),
  );
  const options = line
    ? reconcileOptions(product.parameters, line.options)
    : draft;
  const price = unitPrice(product, options);

  // Вариант параметра по id — чтобы у выбранного узнать его фото.
  const valueById = (valueId: number) => {
    for (const parameter of product.parameters) {
      const value = parameter.values.find((v) => v.id === valueId);
      if (value) return value;
    }
    return undefined;
  };

  // На входе синхронизируем галерею с уже выбранным вариантом: если у него
  // есть фото, показываем сразу его, а не обложку.
  useEffect(() => {
    for (const option of options) {
      const value = valueById(option.valueId);
      if (value?.image) {
        onJumpToImage(value.image);
        break;
      }
    }
    // Только при монтировании: дальше галерею двигают выбор и свайпы.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const change = (parameterId: number, valueId: number) => {
    const next = chooseOption(
      product.parameters,
      options,
      parameterId,
      valueId,
    );
    // Выбрали вариант с фото — листаем галерею на него.
    const value = valueById(valueId);
    if (value?.image) onJumpToImage(value.image);

    if (line) {
      // Цена штуки едет вслед за выбором — иначе в корзине осталась бы
      // цена прежнего варианта.
      dispatch(
        setLineOptions({
          productId: product.id,
          options: next,
          price: unitPrice(product, next),
        }),
      );
    } else {
      setDraft(next);
    }
  };

  return (
    <div className={classes.info}>
      <h1 className={classes.title}>{product.name}</h1>
      <p className={classes.price}>{formatPrice(price)}</p>

      {product.description && (
        <p className={classes.description}>{product.description}</p>
      )}

      {product.parameters.length > 0 && (
        <ProductParameters
          parameters={product.parameters}
          selected={options}
          onChange={change}
        />
      )}

      <AddToCartButton
        className={classes.addToCart}
        product={toCartLine(product, options)}
      />

      <button type="button" className={classes.hintButton} onClick={onHint}>
        🎁 Намекнуть о подарке
      </button>

      <div className={classes.actions}>
        <p className={classes.hint}>Или напишите флористу напрямую:</p>
        <MessengerActions
          message={`${greeting} Интересует букет «${product.name}»`}
        />
      </div>
    </div>
  );
};

const greeting = `Здравствуйте! Я с сайта ${CompanyDomain}.`;

const Fallback: FC<{
  title: string;
  text: string;
  action: React.ReactNode;
}> = ({ title, text, action }) => (
  <Section overline="Каталог" title={title}>
    <div className={classes.fallback} role="status">
      <p className={classes.fallback_text}>{text}</p>
      {action}
    </div>
  </Section>
);
