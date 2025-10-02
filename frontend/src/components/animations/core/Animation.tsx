import React, {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type Ref,
} from 'react';
import type { AnimName, VariantProps } from './types';
import { useInView } from './useInView';

function joinClassNames(
  ...classList: Array<string | false | null | undefined>
): string {
  return classList.filter(Boolean).join(' ');
}

export type AnimationProps = VariantProps & { name: AnimName };

export const Animation = forwardRef<HTMLElement, AnimationProps>(
  (
    {
      as: Component = 'div',
      className,
      style,
      delay = 0,
      duration = 700,
      once = true,
      threshold = 0.15,
      rootMargin = '0px',
      disabled = false,
      name,
      children,
    },
    forwardedRef: Ref<HTMLElement>
  ) => {
    const localElementRef = useRef<Element | null>(null);

    const handleRef = (node: HTMLElement | null) => {
      localElementRef.current = node;

      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef && 'current' in (forwardedRef as object)) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
          node;
      }
    };

    const isVisible = useInView(localElementRef, {
      once,
      threshold,
      rootMargin,
      disabled,
    });

    const animationStyle = useMemo<CSSProperties>(
      () => ({
        ...style,
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
      }),
      [duration, delay, style]
    );

    return (
      <Component
        ref={handleRef as unknown as React.Ref<unknown>}
        className={joinClassNames(
          'anim anim-ease-out',
          isVisible && name,
          className
        )}
        style={animationStyle}
      >
        {children}
      </Component>
    );
  }
);

Animation.displayName = 'Animation';
