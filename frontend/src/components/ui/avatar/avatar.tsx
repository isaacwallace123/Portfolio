import { cn } from '@/lib/utils';
import * as React from 'react';

type Props = {
  src?: string;
  alt?: string;
  name?: string;
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, name, size = 80, className }: Props) {
  const [errored, setErrored] = React.useState(false);

  const initials =
    (name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(s => s[0]?.toUpperCase())
      .join('') || '??';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl ring-2 ring-background/60 shadow-xl',
        'bg-white/5 flex items-center justify-center select-none',
        className
      )}
      style={{ width: size, height: size }}
      aria-label={alt ?? name ?? 'avatar'}
    >
      {!errored && src ? (
        <img
          src={src}
          alt={alt ?? name ?? 'avatar'}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="text-lg font-semibold text-white/80">{initials}</span>
      )}
    </div>
  );
}
