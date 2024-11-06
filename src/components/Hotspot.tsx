import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { Hotspot as HotspotType, CTA } from '../types/hotspot';
import { CTAButton } from './CTAButton';

interface HotspotProps {
  hotspot: HotspotType;
  containerWidth: number;
  containerHeight: number;
  isSelected: boolean;
  onDrag: (e: any, data: { x: number; y: number }) => void;
  onResize: (width: number, height: number) => void;
  onSelect: () => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  onCTAClick: (cta: CTA) => void;
}

export function Hotspot({
  hotspot,
  containerWidth,
  containerHeight,
  isSelected,
  onDrag,
  onResize,
  onSelect,
  onResizeStart,
  onResizeEnd,
  onCTAClick,
}: HotspotProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({
    x: (hotspot.x * containerWidth) / 100,
    y: (hotspot.y * containerHeight) / 100,
  });

  useEffect(() => {
    const calculateScale = () => {
      const baseWidth = 1280;
      const currentScale = containerWidth / baseWidth;
      setScale(Math.max(0.5, Math.min(currentScale, 1.5)));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [containerWidth]);

  useEffect(() => {
    setPosition({
      x: (hotspot.x * containerWidth) / 100,
      y: (hotspot.y * containerHeight) / 100,
    });
  }, [hotspot.x, hotspot.y, containerWidth, containerHeight]);

  const handleDrag = (_: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    
    // Convert position to percentages
    const xPercent = (newPosition.x / containerWidth) * 100;
    const yPercent = (newPosition.y / containerHeight) * 100;
    
    onDrag(_, { x: xPercent, y: yPercent });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onDrag={handleDrag}
      onMouseDown={() => onSelect()}
      bounds="parent"
      grid={[1, 1]}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move transform-gpu ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          width: `${hotspot.width}%`,
          height: `${hotspot.height}%`,
          backgroundColor: hotspot.color,
          opacity: hotspot.opacity,
          borderRadius: hotspot.shape === 'circle' ? '50%' : '0',
          transition: 'width 0.2s, height 0.2s',
          willChange: 'transform',
          touchAction: 'none',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {hotspot.ctas.map((cta) => (
            <CTAButton
              key={cta.id}
              cta={cta}
              onClick={() => onCTAClick(cta)}
              scale={scale}
            />
          ))}
        </div>
        {isSelected && (
          <div
            className="absolute inset-0 ring-1 ring-blue-500 pointer-events-none"
            style={{
              borderRadius: hotspot.shape === 'circle' ? '50%' : '0',
            }}
          />
        )}
      </div>
    </Draggable>
  );
}