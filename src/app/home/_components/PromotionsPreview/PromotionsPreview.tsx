'use client';

import React, { FC } from 'react';

import { useGetPromotionsQuery } from '@/store/api/shopApi';

import { PromotionsPreviewLayout } from '../PromotionsPreviewLayout/PromotionsPreviewLayout';

export const PromotionsPreview: FC = () => {
  const { data: promotions, isLoading, isError } = useGetPromotionsQuery();

  // На главной акции — приятное дополнение, а не смысл страницы. Не
  // приехали (сервер лёг, сеть отвалилась) — просто нет блока: городить
  // сообщение об ошибке ради необязательной секции незачем, ниже и каталог,
  // и способы написать флористу.
  if (isError || (!isLoading && !promotions?.length)) return null;

  return (
    <PromotionsPreviewLayout promotions={promotions} isLoading={isLoading} />
  );
};
