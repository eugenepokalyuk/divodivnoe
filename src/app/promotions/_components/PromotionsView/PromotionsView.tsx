'use client';

import React, { FC } from 'react';

import { selectPromotions } from '@/store/slices/promotions';
import { useAppSelector } from '@/store/hooks';

import { PromotionsViewLayout } from '../PromotionsViewLayout/PromotionsViewLayout';

export const PromotionsView: FC = () => {
  const promotions = useAppSelector(selectPromotions);

  return <PromotionsViewLayout promotions={promotions} />;
};
