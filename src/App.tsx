import { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { VideoPlayer } from './components/VideoPlayer';
import './App.css';

export function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleClose = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Video Hotspot Editor
        </h1>
        
        {!videoUrl ? (
          <VideoUploader onVideoSelect={handleVideoSelect} />
        ) : (
          <VideoPlayer videoUrl={videoUrl} onClose={handleClose} />
        )}
      </div>
    </div>
  );
}