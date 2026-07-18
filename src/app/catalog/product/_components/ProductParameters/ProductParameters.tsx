'use client';

import React, { FC } from 'react';
import { motion } from 'framer-motion';

import type { ProductParameterDto } from '@/store/api/shopApi';
import type { CartOption } from '@/store/slices/cart';
import { formatPrice } from '@/utils/helpers';

import classes from './ProductParameters.module.scss';

interface Props {
  parameters: ProductParameterDto[];
  /** Выбранные варианты — по одному на параметр. */
  selected: CartOption[];
  onChange: (parameterId: number, valueId: number) => void;
}

/** Параметры товара над кнопкой «В корзину»: «Размер», «Нужна ли бутоньерка».
 *
 *  Радиокнопки, а не <select>: вариантов обычно два-три, и выбор должен
 *  быть виден целиком — вместе с тем, что он делает с ценой. Разметка
 *  именно radio (а не кнопки с onClick) ради клавиатуры и скринридера:
 *  стрелки внутри группы и озвучка «выбрано» достаются бесплатно. */
export const ProductParameters: FC<Props> = ({
  parameters,
  selected,
  onChange,
}) => {
  const chosen = new Set(selected.map((option) => option.valueId));

  return (
    <div className={classes.root}>
      {parameters.map((parameter) => (
        <fieldset key={parameter.id} className={classes.group}>
          <legend className={classes.legend}>{parameter.name}</legend>

          <div className={classes.values}>
            {parameter.values.map((value) => {
              const isChosen = chosen.has(value.id);
              return (
                <motion.label
                  key={value.id}
                  className={classes.value}
                  data-active={isChosen}
                  whileTap={{ scale: 0.96 }}
                >
                  <input
                    type="radio"
                    className={classes.input}
                    name={`parameter-${parameter.id}`}
                    value={value.id}
                    checked={isChosen}
                    onChange={() => onChange(parameter.id, value.id)}
                  />
                  <span className={classes.label}>{value.value}</span>
                  {/* Прибавку показываем только если так настроен параметр
                      (галочка «Показывать прибавку к цене» в админке). */}
                  {parameter.show_price && value.price_delta > 0 && (
                    <span className={classes.delta}>
                      +{formatPrice(value.price_delta)}
                    </span>
                  )}
                </motion.label>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
};
