import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLHRElement> & { decorative?: boolean };

export function Separator({ className, decorative = true, ...props }: Props) {
  return (
    <hr
      role={decorative ? 'presentation' : 'separator'}
      className={cn('border-0 h-px bg-white/10 mx-6', className)}
      {...props}
    />
  );
}
