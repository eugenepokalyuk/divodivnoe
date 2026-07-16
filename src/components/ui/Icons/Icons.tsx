import React, { FC, SVGProps } from 'react';

/** Общие иконки проекта. Паттерн как в forma-next: один файл с именованными
 *  компонентами, каждый — <svg> с currentColor и размером 1em (наследует
 *  font-size родителя), плюс проброс props.
 *
 *  Глифы — Google Material Symbols (outlined), система координат
 *  viewBox="0 -960 960 960". Заменить иконку = поменять путь здесь. */
const defaultProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  viewBox: '0 -960 960 960',
  'aria-hidden': true,
} as const;

type Props = SVGProps<SVGSVGElement>;

export const PlusIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
);

export const MinusIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M200-440v-80h560v80H200Z" />
  </svg>
);

export const CloseIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </svg>
);

export const CheckIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>
);

export const ChevronLeftIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
  </svg>
);

export const ChevronRightIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
  </svg>
);

export const CartIcon: FC<Props> = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM208-800h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm106 280h280l152-280H246l68 280Z" />
  </svg>
);
