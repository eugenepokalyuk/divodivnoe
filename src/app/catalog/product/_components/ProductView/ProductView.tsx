'use client';

import React, { FC, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { AddToCartButton } from '@/components/modules';
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

/** Страница товара: /catalog/product/?slug=buket-nezhnost
 *
 *  Товар приезжает с бэкенда уже в браузере (сайт — статика), поэтому,
 *  как и на странице категории, состояний много и каждое ведёт к флористу. */
export const ProductView: FC = () => {
  const slug = useSearchParams().get('slug') ?? '';

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductQuery(slug, { skip: !slug });

  // Хук до ранних return — иначе нарушим правила хуков.
  const [hintOpen, setHintOpen] = useState(false);

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
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        <ProductInfo product={product} onHint={() => setHintOpen(true)} />
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
const ProductInfo: FC<{ product: ProductDto; onHint: () => void }> = ({
  product,
  onHint,
}) => {
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

  const change = (parameterId: number, valueId: number) => {
    const next = chooseOption(
      product.parameters,
      options,
      parameterId,
      valueId,
    );
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
