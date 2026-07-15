import React from 'react';
import type { Metadata } from 'next';

import { PromotionsView } from './_components/PromotionsView/PromotionsView';

export const metadata: Metadata = {
  title: 'Акции',
  description:
    'Действующие акции цветочной мастерской «Диво Дивное»: 500 ₽ на первый заказ от 3500 ₽ и 10% на свадебный букет.',
};

export default function PromotionsPage() {
  return <PromotionsView />;
}
