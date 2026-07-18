'use client';

import { useEffect, useState } from 'react';

import { loadSavedOrders } from '@/lib/orders/savedOrders';
import { useGetFaqsQuery } from '@/store/api/shopApi';
import { NavItem } from '@/utils/consts';

/** Пункты меню с учётом динамических разделов.
 *
 *  «Клиентам» ведёт на блок FAQ, а блока нет, пока в админке нет ни одного
 *  вопроса. «Мои заказы» нужны только тому, кто уже оформлял заказ на этом
 *  устройстве. Ссылку на несуществующий раздел показывать нельзя, поэтому
 *  такие пункты видны только при наличии данных. Пока не проверили —
 *  скрыты: мёртвая ссылка хуже её отсутствия.
 *
 *  Заказы читаем в useEffect, а не при рендере: localStorage есть только в
 *  браузере, и чтение при первом рендере разошлось бы с серверной сборкой
 *  (hydration mismatch). */
export const useVisibleNavItems = (items: NavItem[]): NavItem[] => {
  const { data: faqs } = useGetFaqsQuery();
  const hasFaqs = Boolean(faqs?.length);

  const [hasOrders, setHasOrders] = useState(false);
  useEffect(() => {
    setHasOrders(loadSavedOrders().length > 0);
  }, []);

  return items.filter((item) => {
    if (item.dynamic === 'faq') return hasFaqs;
    if (item.dynamic === 'orders') return hasOrders;
    return true;
  });
};
