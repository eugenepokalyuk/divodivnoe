'use client';

import React, { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store/store';
import { YandexMetrika } from '@/lib/analytics/YandexMetrika';
import { ErrorReporter } from '@/lib/telemetry/ErrorReporter';

import { CartHydrator } from './CartHydrator';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <ErrorReporter />
    <YandexMetrika />
    <CartHydrator />
    {children}
  </Provider>
);
