import React from 'react';
import { useHotspotStore } from '../store/hotspotStore';
import { CTAControls } from './CTAControls';
import { CTA } from '../types/hotspot';

interface HotspotControlsProps {
  previewDevice: 'desktop' | 'tablet' | 'mobile';
}

export function HotspotControls({ previewDevice }: HotspotControlsProps) {
  const { hotspots, selectedHotspot, updateHotspot, deleteHotspot } = useHotspotStore();
  const selectedHotspotData = hotspots.find(h => h.id === selectedHotspot);

  if (!selectedHotspotData) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeStr: string) => {
    const [minutesStr, secondsStr] = timeStr.split(':');
    const [seconds, millisecondsStr] = (secondsStr || '').split('.');
    
    const minutes = parseInt(minutesStr || '0', 10);
    const secs = parseInt(seconds || '0', 10);
    const milliseconds = parseInt(millisecondsStr || '0', 10);

    return minutes * 60 + secs + milliseconds / 100;
  };

  const deviceLabel = {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
  };

  const addCTA = () => {
    const newCTA: CTA = {
      id: Math.random().toString(36).substring(2),
      type: 'message',
      content: 'Click me!',
      buttonText: 'Click me!',
      buttonStyle: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: '14px',
      },
    };

    updateHotspot(selectedHotspot, {
      ctas: [...(selectedHotspotData.ctas || []), newCTA],
    });
  };

  const updateCTA = (ctaId: string, updates: Partial<CTA>) => {
    const updatedCTAs = selectedHotspotData.ctas.map((cta) =>
      cta.id === ctaId ? { ...cta, ...updates } : cta
    );
    updateHotspot(selectedHotspot, { ctas: updatedCTAs });
  };

  const deleteCTA = (ctaId: string) => {
    const updatedCTAs = selectedHotspotData.ctas.filter((cta) => cta.id !== ctaId);
    updateHotspot(selectedHotspot, { ctas: updatedCTAs });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Hotspot Settings</h3>
        <span className="text-sm text-gray-500">
          {deviceLabel[previewDevice]} View
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Video Behavior</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPause"
                checked={selectedHotspotData.autoPause}
                onChange={(e) => updateHotspot(selectedHotspot, { autoPause: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoPause" className="ml-2 block text-sm text-gray-700">
                Auto-pause when hotspot appears
              </label>
            </div>
            {selectedHotspotData.autoPause && (
              <div className="flex items-center ml-6">
                <input
                  type="checkbox"
                  id="keepPlaying"
                  checked={selectedHotspotData.keepPlaying}
                  onChange={(e) => updateHotspot(selectedHotspot, { keepPlaying: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keepPlaying" className="ml-2 block text-sm text-gray-700">
                  Resume playing after interaction
                </label>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Timing</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500">Start Time</label>
              <input
                type="text"
                value={formatTime(selectedHotspotData.startTime)}
                onChange={(e) => {
                  const time = parseTime(e.target.value);
                  if (!isNaN(time)) {
                    updateHotspot(selectedHotspot, { startTime: time });
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="MM:SS.MS"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">End Time</label>
              <input
                type="text"
                value={formatTime(selectedHotspotData.endTime)}
                onChange={(e) => {
                  const time = parseTime(e.target.value);
                  if (!isNaN(time)) {
                    updateHotspot(selectedHotspot, { endTime: time });
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="MM:SS.MS"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Shape</label>
          <select
            value={selectedHotspotData.shape}
            onChange={(e) => updateHotspot(selectedHotspot, { shape: e.target.value as 'rectangle' | 'circle' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={selectedHotspotData.color}
              onChange={(e) => updateHotspot(selectedHotspot, { color: e.target.value })}
              className="h-8 w-8 rounded-md border border-gray-300"
            />
            <span className="text-sm text-gray-500">{selectedHotspotData.color}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Opacity: {Math.round(selectedHotspotData.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedHotspotData.opacity}
            onChange={(e) => updateHotspot(selectedHotspot, { opacity: parseFloat(e.target.value) })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Size</label>
          <div className="mt-1 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Width: {Math.round(selectedHotspotData.width)}%</label>
              <input
                type="range"
                min="5"
                max="50"
                value={selectedHotspotData.width}
                onChange={(e) => updateHotspot(selectedHotspot, { width: parseFloat(e.target.value) })}
                className="block w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Height: {Math.round(selectedHotspotData.height)}%</label>
              <input
                type="range"
                min="5"
                max="50"
                value={selectedHotspotData.height}
                onChange={(e) => updateHotspot(selectedHotspot, { height: parseFloat(e.target.value) })}
                className="block w-full"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Call to Actions</h4>
            <button
              onClick={addCTA}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Add CTA
            </button>
          </div>
          
          {selectedHotspotData.ctas?.map((cta) => (
            <CTAControls
              key={cta.id}
              cta={cta}
              onUpdate={(updates) => updateCTA(cta.id, updates)}
              onDelete={() => deleteCTA(cta.id)}
            />
          ))}
        </div>

        <button
          onClick={() => deleteHotspot(selectedHotspot)}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete Hotspot
        </button>
      </div>
    </div>
  );
}