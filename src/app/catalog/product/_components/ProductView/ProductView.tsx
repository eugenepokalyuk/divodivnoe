'use client';

import React, { FC, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { AddToCartButton } from '@/components/modules';
import { Button, MessengerActions, Section } from '@/components/ui';
import { useGetProductQuery } from '@/store/api/shopApi';
import { CompanyDomain, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import { GiftHintModal } from '../GiftHintModal/GiftHintModal';
import { ProductGallery } from '../ProductGallery/ProductGallery';

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

        <div className={classes.info}>
          <h1 className={classes.title}>{product.name}</h1>
          <p className={classes.price}>{formatPrice(product.price)}</p>

          {product.description && (
            <p className={classes.description}>{product.description}</p>
          )}

          <AddToCartButton
            className={classes.addToCart}
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />

          <button
            type="button"
            className={classes.hintButton}
            onClick={() => setHintOpen(true)}
          >
            🎁 Намекнуть о подарке
          </button>

          <div className={classes.actions}>
            <p className={classes.hint}>Или напишите флористу напрямую:</p>
            <MessengerActions
              message={`${greeting} Интересует букет «${product.name}»`}
            />
          </div>
        </div>
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
