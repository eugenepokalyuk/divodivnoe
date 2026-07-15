'use client';

import React, { FC } from 'react';

import { useGetPromotionsQuery } from '@/store/api/shopApi';

import { PromotionsViewLayout } from '../PromotionsViewLayout/PromotionsViewLayout';

export const PromotionsView: FC = () => {
  const { data: promotions, isLoading, isError } = useGetPromotionsQuery();

  return (
    <PromotionsViewLayout
      promotions={promotions}
      isLoading={isLoading}
      isError={isError}
    />
  );
};
