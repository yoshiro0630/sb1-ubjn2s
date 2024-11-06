import { create } from 'zustand';
import { Hotspot, CTA } from '../types/hotspot';

interface HotspotStore {
  hotspots: Hotspot[];
  selectedHotspot: string | null;
  addHotspot: (hotspot: Omit<Hotspot, 'id'>) => void;
  updateHotspot: (id: string, updates: Partial<Hotspot>) => void;
  deleteHotspot: (id: string) => void;
  selectHotspot: (id: string | null) => void;
}

export const useHotspotStore = create<HotspotStore>((set) => ({
  hotspots: [],
  selectedHotspot: null,
  addHotspot: (hotspot) =>
    set((state) => ({
      hotspots: [
        ...state.hotspots,
        {
          ...hotspot,
          id: Math.random().toString(36).substring(2),
          autoPause: true,
          keepPlaying: false,
        },
      ],
    })),
  updateHotspot: (id, updates) =>
    set((state) => ({
      hotspots: state.hotspots.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    })),
  deleteHotspot: (id) =>
    set((state) => ({
      hotspots: state.hotspots.filter((h) => h.id !== id),
      selectedHotspot: state.selectedHotspot === id ? null : state.selectedHotspot,
    })),
  selectHotspot: (id) => set({ selectedHotspot: id }),
}));