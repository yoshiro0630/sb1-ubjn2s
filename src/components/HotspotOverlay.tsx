import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useHotspotStore } from '../store/hotspotStore';
import { Hotspot } from './Hotspot';
import { CTA } from '../types/hotspot';

interface HotspotOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
}

export function HotspotOverlay({ videoRef, previewDevice }: HotspotOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAnyHotspotResizing, setIsAnyHotspotResizing] = useState(false);
  const { hotspots, addHotspot, updateHotspot, selectHotspot, selectedHotspot } = useHotspotStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [messageOverlay, setMessageOverlay] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });
  const [activeHotspotIds, setActiveHotspotIds] = useState<Set<string>>(new Set());
  const [interactedHotspotIds, setInteractedHotspotIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updateDimensions = () => {
      if (overlayRef.current) {
        const rect = overlayRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const resizeObserver = new ResizeObserver(updateDimensions);
    
    if (overlayRef.current) {
      resizeObserver.observe(overlayRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, [previewDevice]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef]);

  useEffect(() => {
    const currentActiveHotspots = new Set(
      hotspots
        .filter(hotspot => currentTime >= hotspot.startTime && currentTime <= hotspot.endTime)
        .map(hotspot => hotspot.id)
    );

    setInteractedHotspotIds(prev => {
      const next = new Set(prev);
      for (const id of prev) {
        if (!currentActiveHotspots.has(id)) {
          next.delete(id);
        }
      }
      return next;
    });

    setActiveHotspotIds(currentActiveHotspots);
  }, [currentTime, hotspots]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPause = Array.from(activeHotspotIds).some(id => {
      const hotspot = hotspots.find(h => h.id === id);
      return hotspot?.autoPause && !interactedHotspotIds.has(id);
    });

    if (shouldPause && !video.paused) {
      video.pause();
    }
  }, [activeHotspotIds, interactedHotspotIds, hotspots, videoRef]);

  const getDeviceScale = useCallback(() => {
    switch (previewDevice) {
      case 'desktop': return 1;
      case 'tablet': return 0.6;
      case 'mobile': return 0.3;
      default: return 1;
    }
  }, [previewDevice]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== overlayRef.current || isAnyHotspotResizing) return;

    const rect = overlayRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const currentVideoTime = videoRef.current?.currentTime || 0;

    addHotspot({
      x,
      y,
      width: 10 * getDeviceScale(),
      height: 10 * getDeviceScale(),
      shape: 'rectangle',
      color: '#FF0000',
      opacity: 0.5,
      startTime: currentVideoTime,
      endTime: Math.min((videoRef.current?.duration || 0), currentVideoTime + 5),
      ctas: [],
      autoPause: true,
      keepPlaying: false,
    });
  }, [addHotspot, isAnyHotspotResizing, videoRef, getDeviceScale]);

  const handleDrag = useCallback((id: string, data: { x: number; y: number }) => {
    const constrainedX = Math.max(0, Math.min(data.x, 100));
    const constrainedY = Math.max(0, Math.min(data.y, 100));

    updateHotspot(id, {
      x: constrainedX,
      y: constrainedY,
    });
  }, [updateHotspot]);

  const handleResize = useCallback((id: string, width: number, height: number) => {
    updateHotspot(id, { 
      width: width * getDeviceScale(),
      height: height * getDeviceScale(),
    });
  }, [updateHotspot, getDeviceScale]);

  const handleCTAClick = useCallback((hotspotId: string, cta: CTA) => {
    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return;

    setInteractedHotspotIds(prev => new Set(prev).add(hotspotId));

    switch (cta.type) {
      case 'url':
        window.open(cta.content, '_blank');
        break;
      case 'message':
        setMessageOverlay({ message: cta.content, visible: true });
        setTimeout(() => setMessageOverlay({ message: '', visible: false }), 3000);
        break;
      case 'pause':
        if (videoRef.current) {
          videoRef.current.pause();
        }
        break;
    }

    if (hotspot.keepPlaying && videoRef.current) {
      videoRef.current.play();
    }
  }, [hotspots, videoRef]);

  const visibleHotspots = hotspots.filter(
    hotspot => currentTime >= hotspot.startTime && currentTime <= hotspot.endTime
  );

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 cursor-crosshair overflow-hidden touch-none"
      onClick={handleClick}
    >
      {visibleHotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
          isSelected={selectedHotspot === hotspot.id}
          onDrag={(e, data) => handleDrag(hotspot.id, data)}
          onResize={(width, height) => handleResize(hotspot.id, width, height)}
          onSelect={() => selectHotspot(hotspot.id)}
          onResizeStart={() => setIsAnyHotspotResizing(true)}
          onResizeEnd={() => setIsAnyHotspotResizing(false)}
          onCTAClick={(cta) => handleCTAClick(hotspot.id, cta)}
          deviceScale={getDeviceScale()}
        />
      ))}
      
      {messageOverlay.visible && (
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md"
          style={{
            fontSize: `${Math.max(14, Math.min(16 * (dimensions.width / 1280), 20))}px`,
          }}
        >
          {messageOverlay.message}
        </div>
      )}
    </div>
  );
}