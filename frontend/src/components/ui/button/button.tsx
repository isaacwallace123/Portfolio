import { cn } from '@/lib/utils';
import React from 'react';
import { Link } from 'react-router-dom';
import './button.css';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline' | 'ghost' | 'gradient' | 'glass';

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  isDeep?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  radius?: number;
  font?: string;
  textSize?: string;
  weight?: number | '400' | '500' | '600' | '700';
  padX?: string | number;
  padY?: string | number;
  tone?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  gradient?: string;
  ariaLabel?: string;
};

type ButtonLink = BaseProps & {
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
type ButtonAnchor = BaseProps & {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};
type ButtonNative = BaseProps & {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type ButtonProps = ButtonLink | ButtonAnchor | ButtonNative;

const VARIANTS: Record<Variant, string> = {
  solid: 'ui-btn--solid',
  outline: 'ui-btn--outline',
  ghost: 'ui-btn--ghost',
  gradient: 'ui-btn--gradient',
  glass: 'ui-btn--glass',
};

const SIZES: Record<Size, string> = {
  sm: 'ui-btn--sm',
  md: 'ui-btn--md',
  lg: 'ui-btn--lg',
};

type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export function Button(props: ButtonProps) {
  const {
    children,
    className,
    variant = 'solid',
    size = 'md',
    isDeep,
    fullWidth,
    loading,
    radius = 12,
    font,
    textSize,
    weight = 600,
    padX,
    padY,
    tone,
    bgColor,
    textColor,
    borderColor,
    gradient,
    ariaLabel,
  } = props;

  const classes = cn(
    'ui-btn',
    VARIANTS[variant],
    SIZES[size],
    isDeep && 'ui-btn--deep',
    fullWidth && 'ui-btn--block',
    loading && 'pointer-events-none opacity-60',
    className
  );

  const style: CSSVars = {
    '--btn-radius': `${radius}px`,
    '--btn-font': font,
    '--btn-text-size': textSize,
    '--btn-weight': String(weight),
    '--btn-pad-x': typeof padX === 'number' ? `${padX}px` : padX,
    '--btn-pad-y': typeof padY === 'number' ? `${padY}px` : padY,
    '--tone': tone,
    '--btn-bg': bgColor,
    '--btn-fg': textColor,
    '--btn-border': borderColor,
    '--btn-gradient': gradient,
  };

  const common = {
    className: classes,
    style,
    'aria-label': ariaLabel,
    'aria-busy': loading || undefined,
  };

  if ('to' in props)
    return (
      <Link to={props.to} onClick={props.onClick} {...common}>
        {children}
      </Link>
    );
  if ('href' in props)
    return (
      <a href={props.href} onClick={props.onClick} {...common}>
        {children}
      </a>
    );

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled || loading}
      {...common}
    >
      {children}
    </button>
  );
}
