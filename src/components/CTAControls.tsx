import React from 'react';
import { CTA, CTAType } from '../types/hotspot';

interface CTAControlsProps {
  cta: CTA;
  onUpdate: (updates: Partial<CTA>) => void;
  onDelete: () => void;
}

export function CTAControls({ cta, onUpdate, onDelete }: CTAControlsProps) {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">CTA Type</label>
        <select
          value={cta.type}
          onChange={(e) => onUpdate({ type: e.target.value as CTAType })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="url">URL Link</option>
          <option value="message">Display Message</option>
          <option value="pause">Pause Video</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {cta.type === 'url' ? 'URL' : 'Message Content'}
        </label>
        <input
          type="text"
          value={cta.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder={cta.type === 'url' ? 'https://example.com' : 'Enter message'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Button Text</label>
        <input
          type="text"
          value={cta.buttonText || ''}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Click me!"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Button Style</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500">Background Color</label>
            <input
              type="color"
              value={cta.buttonStyle?.backgroundColor || '#ffffff'}
              onChange={(e) =>
                onUpdate({
                  buttonStyle: {
                    ...cta.buttonStyle,
                    backgroundColor: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Text Color</label>
            <input
              type="color"
              value={cta.buttonStyle?.textColor || '#000000'}
              onChange={(e) =>
                onUpdate({
                  buttonStyle: {
                    ...cta.buttonStyle,
                    textColor: e.target.value,
                  },
                })
              }
              className="mt-1 block w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Font Size</label>
          <select
            value={cta.buttonStyle?.fontSize || '14px'}
            onChange={(e) =>
              onUpdate({
                buttonStyle: {
                  ...cta.buttonStyle,
                  fontSize: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="12px">Small</option>
            <option value="14px">Medium</option>
            <option value="16px">Large</option>
            <option value="18px">Extra Large</option>
          </select>
        </div>
      </div>

      <button
        onClick={onDelete}
        className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
      >
        Remove CTA
      </button>
    </div>
  );
}