import React from 'react';
import { CTA } from '../types/hotspot';

interface CTAButtonProps {
  cta: CTA;
  onClick: () => void;
  scale: number;
}

export function CTAButton({ cta, onClick, scale }: CTAButtonProps) {
  const baseFontSize = parseInt(cta.buttonStyle?.fontSize || '14px');
  const scaledFontSize = Math.max(12, Math.min(baseFontSize * scale, 24));

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="px-4 py-2 rounded-md transition-all transform-gpu hover:scale-105"
      style={{
        backgroundColor: cta.buttonStyle?.backgroundColor || '#ffffff',
        color: cta.buttonStyle?.textColor || '#000000',
        fontSize: `${scaledFontSize}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {cta.icon && (
        <span className="mr-2">
          <i className={`fas ${cta.icon}`}></i>
        </span>
      )}
      {cta.buttonText || cta.content}
    </button>
  );
}