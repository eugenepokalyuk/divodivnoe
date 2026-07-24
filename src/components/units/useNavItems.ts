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
/** Предикат видимости одного пункта — чтобы фильтровать не только плоский
 *  список (футер), но и вперемешку с группами (шапка с дропдаунами). */
export const useNavVisibility = (): ((item: NavItem) => boolean) => {
  const { data: faqs } = useGetFaqsQuery();
  const hasFaqs = Boolean(faqs?.length);

  const [hasOrders, setHasOrders] = useState(false);
  useEffect(() => {
    setHasOrders(loadSavedOrders().length > 0);
  }, []);

  return (item: NavItem) => {
    if (item.dynamic === 'faq') return hasFaqs;
    if (item.dynamic === 'orders') return hasOrders;
    return true;
  };
};

export const useVisibleNavItems = (items: NavItem[]): NavItem[] => {
  const isVisible = useNavVisibility();
  return items.filter(isVisible);
};
