export type CTAType = 'url' | 'message' | 'pause';

export interface CTA {
  id: string;
  type: CTAType;
  content: string;
  buttonText?: string;
  buttonStyle?: {
    backgroundColor: string;
    textColor: string;
    fontSize: string;
  };
  icon?: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'circle' | 'rectangle';
  color: string;
  opacity: number;
  startTime: number;
  endTime: number;
  ctas: CTA[];
  autoPause: boolean;
  keepPlaying: boolean;
}