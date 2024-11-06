import React from 'react';

interface DevicePreviewProps {
  currentDevice: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

export function DevicePreview({ currentDevice, onDeviceChange }: DevicePreviewProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black bg-opacity-50 rounded-full p-1">
      <button
        onClick={() => onDeviceChange('desktop')}
        className={`p-2 rounded-full transition-colors ${
          currentDevice === 'desktop'
            ? 'text-blue-400 bg-white bg-opacity-10'
            : 'text-white hover:text-blue-400'
        }`}
        title="Desktop view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={() => onDeviceChange('tablet')}
        className={`p-2 rounded-full transition-colors ${
          currentDevice === 'tablet'
            ? 'text-blue-400 bg-white bg-opacity-10'
            : 'text-white hover:text-blue-400'
        }`}
        title="Tablet view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={() => onDeviceChange('mobile')}
        className={`p-2 rounded-full transition-colors ${
          currentDevice === 'mobile'
            ? 'text-blue-400 bg-white bg-opacity-10'
            : 'text-white hover:text-blue-400'
        }`}
        title="Mobile view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}