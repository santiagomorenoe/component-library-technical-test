'use client';

import { InputHTMLAttributes, useId } from 'react';
import { componentTokens } from '@/lib/design-tokens';

export type InputType = 'text' | 'email' | 'password';
export type ValidationState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType;
  validationState?: ValidationState;
  label?: string;
  errorMessage?: string;
  successMessage?: string;
}

export function Input({
  type = 'text',
  validationState = 'default',
  label,
  errorMessage,
  successMessage,
  disabled = false,
  className = '',
  id: providedId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const t = componentTokens.input;

  const inputClasses = [t.base, t.states[validationState], className]
    .filter(Boolean)
    .join(' ');

  const helperText =
    validationState === 'error'
      ? errorMessage
      : validationState === 'success'
        ? successMessage
        : null;

  return (
    <div className={t.wrapper}>
      {label && (
        <label htmlFor={id} className={t.label}>
          {label}
        </label>
      )}
      <input
        {...props}
        id={id}
        type={type}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={validationState === 'error'}
        aria-describedby={helperText ? `${id}-helper` : undefined}
      />
      {helperText && (
        <span
          id={`${id}-helper`}
          className={t.helperText[validationState as 'error' | 'success']}
          role={validationState === 'error' ? 'alert' : undefined}
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
