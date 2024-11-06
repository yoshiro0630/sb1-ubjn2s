import React, { useRef, useState } from 'react';
import { HotspotOverlay } from './HotspotOverlay';
import { HotspotControls } from './HotspotControls';
import { VideoControls } from './VideoControls';
import { DevicePreview } from './DevicePreview';
import { useHotspotStore } from '../store/hotspotStore';

interface VideoPlayerProps {
  videoUrl: string;
  onClose: () => void;
}

export function VideoPlayer({ videoUrl, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectedHotspot = useHotspotStore((state) => state.selectedHotspot);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceSizes = {
    desktop: 'w-full max-w-[1280px]',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[375px]',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:flex-1">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <DevicePreview
            currentDevice={previewDevice}
            onDeviceChange={setPreviewDevice}
          />

          <div className={`relative mx-auto transition-all duration-300 ${deviceSizes[previewDevice]}`}>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full"
            />
            <HotspotOverlay 
              videoRef={videoRef}
              previewDevice={previewDevice} 
            />
          </div>
          <VideoControls videoRef={videoRef} />
        </div>
      </div>
      
      <div className="lg:w-80">
        {selectedHotspot ? (
          <HotspotControls previewDevice={previewDevice} />
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-500 text-center">
              Click anywhere on the video to create a hotspot
            </p>
          </div>
        )}
      </div>
    </div>
  );
}