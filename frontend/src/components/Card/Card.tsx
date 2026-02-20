import { ReactNode } from 'react';
import { componentTokens } from '@/lib/design-tokens';

export type CardBorderStyle = 'none' | 'default' | 'accent';

export interface CardImage {
  src: string;
  alt: string;
}

export interface CardProps {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  image?: CardImage;
  borderStyle?: CardBorderStyle;
  className?: string;
}

export function Card({
  header,
  children,
  footer,
  image,
  borderStyle = 'default',
  className = '',
}: CardProps) {
  const t = componentTokens.card;

  const cardClasses = [t.base, t.borders[borderStyle], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      {image && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
          <img
            src={image.src}
            alt={image.alt}
            className={t.image}
            style={{ height: '100%' }}
          />
        </div>
      )}
      {header !== undefined && <div className={t.header}>{header}</div>}
      {children !== undefined && <div className={t.body}>{children}</div>}
      {footer !== undefined && <div className={t.footer}>{footer}</div>}
    </div>
  );
}
