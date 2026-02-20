'use client';

import { ReactNode, useEffect } from 'react';
import { componentTokens } from '@/lib/design-tokens';

export type ModalSize = 'small' | 'medium' | 'large';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlay?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  size = 'medium',
  header,
  children,
  footer,
  closeOnOverlay = true,
}: ModalProps) {
  const t = componentTokens.modal;

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={t.overlay}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`${t.container} ${t.sizes[size]}`}
        data-testid="modal-container"
      >
        {/* Header — always rendered to house the close button */}
        <div className={t.header}>
          {header !== undefined ? (
            <div className="text-lg font-semibold text-gray-900">{header}</div>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className={t.closeBtn}
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={t.body}>{children}</div>

        {/* Footer */}
        {footer !== undefined && <div className={t.footer}>{footer}</div>}
      </div>
    </div>
  );
}
