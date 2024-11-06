import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

export function VideoUpload({ onVideoSelect }: VideoUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'video/mp4') {
      onVideoSelect(file);
    }
  }, [onVideoSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the video here...'
            : 'Drag and drop an MP4 video, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Only MP4 files are supported</p>
      </div>
    </div>
  );
}