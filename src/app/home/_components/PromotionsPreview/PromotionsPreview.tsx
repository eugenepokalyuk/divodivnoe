'use client';

import React, { FC } from 'react';

import { selectPromotions } from '@/store/slices/promotions';
import { useAppSelector } from '@/store/hooks';

import { PromotionsPreviewLayout } from '../PromotionsPreviewLayout/PromotionsPreviewLayout';

export const PromotionsPreview: FC = () => {
  const promotions = useAppSelector(selectPromotions);

  if (!promotions.length) return null;

  return <PromotionsPreviewLayout promotions={promotions} />;
};
