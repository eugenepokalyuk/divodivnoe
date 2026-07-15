import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store/store';

const selectPromotionsState = (state: RootState) => state.promotions;

export const selectPromotions = createSelector(
  selectPromotionsState,
  (state) => state.items,
);
