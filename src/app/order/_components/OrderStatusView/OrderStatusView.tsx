'use client';

import React, { FC } from 'react';
import { useSearchParams } from 'next/navigation';

import { Button, Section } from '@/components/ui';
import { useGetOrderStatusQuery } from '@/store/api/shopApi';
import type { OrderStatusStep } from '@/store/api/shopApi';
import { loadSavedOrders } from '@/lib/orders/savedOrders';
import { orderRoute, Routes } from '@/utils/consts';
import { formatPrice } from '@/utils/helpers';

import classes from './OrderStatusView.module.scss';

/** Страница отслеживания заказа: /order/?id=<токен>
 *
 *  Без токена — показываем сохранённые на устройстве заказы (памятка).
 *  С токеном — тянем статус с бэкенда и рисуем ленту. Периодически
 *  обновляем: флорист может сменить статус, пока покупатель смотрит. */
export const OrderStatusView: FC = () => {
  const token = useSearchParams().get('id') ?? '';

  const { data, isLoading, isError, error } = useGetOrderStatusQuery(token, {
    skip: !token,
    pollingInterval: 30000,
  });

  if (!token) return <SavedOrders />;

  if (isLoading) {
    return (
      <Section overline="Заказ">
        <div className={classes.skeleton} aria-busy="true" />
      </Section>
    );
  }

  const notFound = isError && (error as { status?: number })?.status === 404;
  if (notFound) {
    return (
      <Fallback
        title="Заказ не найден"
        text="Ссылка устарела или неверна. Проверьте адрес — статус открывается по ссылке из подтверждения заказа."
      />
    );
  }

  if (isError || !data) {
    return (
      <Fallback
        title="Не получилось загрузить"
        text="Обновите страницу через минуту — возможно, был кратковременный сбой связи."
      />
    );
  }

  const cancelled = data.status === 'cancelled';

  return (
    <Section overline="Заказ" title={`Заказ №${data.number}`}>
      <div className={classes.card}>
        <p className={classes.current} data-cancelled={cancelled}>
          {data.status_display}
        </p>
        <p className={classes.sum}>Сумма к оплате: {formatPrice(data.total)}</p>

        <ol className={classes.timeline}>
          {data.timeline.map((step, index) => (
            <Step
              key={`${step.status}-${index}`}
              step={step}
              last={index === data.timeline.length - 1}
              cancelled={cancelled}
            />
          ))}
        </ol>

        <p className={classes.note}>
          {cancelled
            ? 'Если это ошибка — напишите нам, поможем оформить заново.'
            : 'Флорист свяжется с вами, чтобы подтвердить детали и доставку.'}
        </p>

        <Button href={Routes.Catalog} variant="outlined">
          В каталог
        </Button>
      </div>
    </Section>
  );
};

const Step: FC<{
  step: OrderStatusStep;
  last: boolean;
  cancelled: boolean;
}> = ({ step, last, cancelled }) => (
  <li
    className={classes.step}
    data-current={last}
    data-cancelled={cancelled && last}
  >
    <span className={classes.marker} aria-hidden />
    <span className={classes.stepBody}>
      <span className={classes.stepLabel}>{step.label}</span>
      <span className={classes.stepTime}>{formatWhen(step.at)}</span>
    </span>
  </li>
);

/** Сохранённые на устройстве заказы — когда открыли /order без токена. */
const SavedOrders: FC = () => {
  const orders = loadSavedOrders();

  if (orders.length === 0) {
    return (
      <Fallback
        title="Заказ открывается по ссылке"
        text="Ссылку на статус вы получаете сразу после оформления. Здесь же появятся заказы, сделанные на этом устройстве."
      />
    );
  }

  return (
    <Section overline="Заказы" title="Ваши заказы">
      <ul className={classes.saved}>
        {orders.map((o) => (
          <li key={o.token}>
            <a className={classes.savedLink} href={orderRoute(o.token)}>
              <span>Заказ №{o.number}</span>
              <span className={classes.savedDate}>{formatWhen(o.at)}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const Fallback: FC<{ title: string; text: string }> = ({ title, text }) => (
  <Section overline="Заказ" title={title}>
    <div className={classes.fallback} role="status">
      <p className={classes.fallback_text}>{text}</p>
      <Button href={Routes.Catalog} variant="outlined">
        В каталог
      </Button>
    </div>
  </Section>
);

/** «18.07.2026, 14:32» — из ISO-времени бэкенда. */
function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
