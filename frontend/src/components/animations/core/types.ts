import type { ElementType, CSSProperties, PropsWithChildren } from 'react';

export type AnimName =
  | 'anim-fade'
  | 'anim-slide-up'
  | 'anim-slide-down'
  | 'anim-slide-left'
  | 'anim-slide-right'
  | 'anim-zoom-in';

export type BaseProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  disabled?: boolean;
};

export type VariantProps = PropsWithChildren<BaseProps>;
