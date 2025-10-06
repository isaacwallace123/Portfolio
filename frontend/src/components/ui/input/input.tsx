import { cn } from '@/lib/utils';
import type { InputHTMLAttributes, ReactNode } from 'react';

import './input.css';

export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'outline' | 'subtle' | 'solid' | 'glass';

type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: Size;

  variant?: Variant;

  fullWidth?: boolean;

  radius?: number;

  tone?: string;

  bgColor?: string;
  textColor?: string;
  borderColor?: string;

  start?: ReactNode;
  end?: ReactNode;

  invalid?: boolean;
};

const SIZES: Record<Size, string> = {
  sm: 'ui-input--sm',
  md: 'ui-input--md',
  lg: 'ui-input--lg',
};

const VARIANTS: Record<Variant, string> = {
  outline: 'ui-input--outline',
  subtle: 'ui-input--subtle',
  solid: 'ui-input--solid',
  glass: 'ui-input--glass',
};

export function Input({
  className,
  size = 'md',
  variant = 'outline',
  fullWidth,
  radius = 12,
  tone,
  bgColor,
  textColor,
  borderColor,
  start,
  end,
  invalid,
  type = 'text',
  ...props
}: InputProps) {
  const classes = cn(
    'ui-input',
    SIZES[size],
    VARIANTS[variant],
    fullWidth && 'ui-input--block',
    invalid && 'ui-input--invalid',
    className
  );

  const style: CSSVars = {
    '--input-radius': `${radius}px`,
    '--tone': tone,
    '--input-bg': bgColor,
    '--input-fg': textColor,
    '--input-border': borderColor,
  };

  return (
    <label className={classes} style={style}>
      {start ? <span className="ui-input__start">{start}</span> : null}
      <input
        type={type}
        className="ui-input__field"
        aria-invalid={invalid || undefined}
        {...props}
      />
      {end ? <span className="ui-input__end">{end}</span> : null}
    </label>
  );
}

export default Input;
