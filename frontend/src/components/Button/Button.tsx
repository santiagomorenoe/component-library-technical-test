'use client';

import { ButtonHTMLAttributes, ReactNode, useEffect } from 'react';
import { componentTokens } from '@/lib/design-tokens';
import { track } from '@/lib/tracker';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  trackingName?: string;
  trackingVariant?: string;
  projectId?: string;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-testid="spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  trackingName = 'Button',
  trackingVariant,
  projectId,
  className = '',
  children,
  onClick,
  ...props
}: ButtonProps) {
  const t = componentTokens.button;

  const classes = [
    t.base,
    t.variants[variant],
    t.sizes[size],
    loading ? t.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  useEffect(() => {
    track({
      componentName: trackingName,
      variant: trackingVariant ?? variant,
      action: 'mount',
      projectId,
    });
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    track({
      componentName: trackingName,
      variant: trackingVariant ?? variant,
      action: 'click',
      projectId,
    });
    onClick?.(e);
  }

  const showLeftIcon = !loading && icon && iconPosition === 'left';
  const showRightIcon = !loading && icon && iconPosition === 'right';
  const showLeftSpinner = loading && (iconPosition === 'left' || !icon);
  const showRightSpinner = loading && icon && iconPosition === 'right';

  return (
    <button
      {...props}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-busy={loading}
    >
      {showLeftSpinner && <Spinner />}
      {showLeftIcon && icon}
      <span>{children}</span>
      {showRightIcon && icon}
      {showRightSpinner && <Spinner />}
    </button>
  );
}
