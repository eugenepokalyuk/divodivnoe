import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TelegramContact } from '@/utils/consts';

import { Promotion, PromotionId, PromotionsState } from './types';

/** Действующие акции. Пока задаются здесь — когда появится админка,
 *  список приедет с бэкенда и ляжет в стейт через setPromotions. */
const initialPromotions: Promotion[] = [
  {
    id: PromotionId.FirstOrder,
    title: 'Первый заказ — 500 ₽ в подарок',
    description:
      'Дарим 500 ₽ на первый букет при заказе от 3500 ₽. Скидка применяется к любой позиции каталога.',
    badge: '500 ₽',
    code: 'FIRST500',
    terms: 'При заказе от 3500 ₽. Один раз на клиента.',
    contact: TelegramContact.Manager,
  },
  {
    id: PromotionId.WeddingBouquet,
    title: '10% на свадебный букет',
    description:
      'Скидка 10% на букет невесты и оформление свадебной флористики. Собираем образ под платье и палитру торжества.',
    badge: '10%',
    code: 'WEDDING10',
    terms: '', // При бронировании даты за 14 дней.
    contact: TelegramContact.Manager,
  },
];

const initialState: PromotionsState = {
  items: initialPromotions,
};

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.items = action.payload;
    },
  },
});

export const promotionsActions = promotionsSlice.actions;
export const promotionsReducer = promotionsSlice.reducer;
