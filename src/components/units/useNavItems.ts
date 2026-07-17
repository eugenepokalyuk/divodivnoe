'use client';

import { useGetFaqsQuery } from '@/store/api/shopApi';
import { NavItem } from '@/utils/consts';

/** Пункты меню с учётом динамических разделов.
 *
 *  Пункт «Клиентам» ведёт на блок FAQ, а блока нет, пока в админке нет
 *  ни одного вопроса. Ссылку на несуществующий якорь показывать нельзя,
 *  поэтому пункты с dynamic:'faq' видны только когда вопросы есть. Пока
 *  данные грузятся или не пришли — пункт скрыт: мёртвая ссылка хуже её
 *  отсутствия. */
export const useVisibleNavItems = (items: NavItem[]): NavItem[] => {
  const { data: faqs } = useGetFaqsQuery();
  const hasFaqs = Boolean(faqs?.length);

  return items.filter((item) => item.dynamic !== 'faq' || hasFaqs);
};
