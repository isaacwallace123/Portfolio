import { useEffect, useState, type RefObject } from 'react';
import type { BaseProps } from './types';

export function useInView(
  ref: RefObject<Element | null>,
  {
    once = true,
    threshold = 0.15,
    rootMargin = '0px',
    disabled = false,
  }: Pick<BaseProps, 'once' | 'threshold' | 'rootMargin' | 'disabled'>
) {
  const [visible, setVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setVisible(true);
      return;
    }

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { root: null, rootMargin, threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, rootMargin, disabled, ref]);

  return visible;
}
