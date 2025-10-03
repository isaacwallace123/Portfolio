import { cn } from '@/lib/utils';
import * as React from 'react';

type Variant = 'solid' | 'outline' | 'secondary';
type Size = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size;
}

export function Badge({
  className,
  variant = 'secondary',
  size = 'sm',
  ...props
}: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full';
  const sizes = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }[size];

  const styles =
    variant === 'solid'
      ? 'bg-[rgb(var(--color-brand))] text-background'
      : variant === 'outline'
        ? 'border border-white/20 text-white/90'
        : 'bg-white/8 text-white/90';

  return <span className={cn(base, sizes, styles, className)} {...props} />;
}
