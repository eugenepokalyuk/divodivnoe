'use client';

import React, { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store/store';

import { CartHydrator } from './CartHydrator';

export const AppProviders: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <CartHydrator />
    {children}
  </Provider>
);
