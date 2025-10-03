import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline' | 'ghost' | 'gradient' | 'glass';

type AnchorClick = React.MouseEventHandler<HTMLAnchorElement>;
type ButtonClick = React.MouseEventHandler<HTMLButtonElement>;

type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

type BaseProps = {
  children: React.ReactNode;

  variant?: Variant;
  size?: Size;
  isDeep?: boolean;
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

  className?: string;
  ariaLabel?: string;

  fullWidth?: boolean;
  loading?: boolean;
};

type ButtonLink = BaseProps & {
  to: string;
  as?: 'link';
  onClick?: AnchorClick;
};

type ButtonAnchor = BaseProps & {
  href: string;
  as?: 'a';
  onClick?: AnchorClick;
};

type ButtonNative = BaseProps & {
  as?: 'button';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: ButtonClick;
};

export type ButtonProps = ButtonLink | ButtonAnchor | ButtonNative;

export function Button(props: ButtonProps) {
  const {
    children,
    variant,
    size = 'md',
    isDeep = false,
    radius = 12,
    font,
    textSize,
    weight = 600,
    bgColor,
    textColor,
    borderColor,
    gradient,
    className,
    ariaLabel,
    fullWidth,
    loading,
    padX,
    padY,
    tone,
  } = props;

  const cls =
    `ui-btn` +
    (variant ? ` ui-btn--${variant}` : '') +
    ` ui-btn--${size}` +
    (isDeep ? ' ui-btn--deep' : '') +
    (fullWidth ? ' ui-btn--block' : '') +
    (className ? ` ${className}` : '');

  const style: CSSVars = {
    '--btn-radius': `${radius}px`,
    '--btn-font': font,
    '--btn-text-size': textSize,
    '--btn-weight': String(weight),
    '--btn-bg': bgColor,
    '--btn-fg': textColor,
    '--btn-border': borderColor,
    '--btn-gradient': gradient,
    '--btn-pad-x': typeof padX === 'number' ? `${padX}px` : padX,
    '--btn-pad-y': typeof padY === 'number' ? `${padY}px` : padY,
    '--tone': tone,
  };

  if ('to' in props) {
    const { to, onClick } = props;
    return (
      <Link
        to={to}
        className={cls}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        style={style}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  if ('href' in props) {
    const { href, onClick } = props;
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        style={style}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  const { type = 'button', onClick, disabled } = props;
  return (
    <button
      type={type}
      className={cls}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
