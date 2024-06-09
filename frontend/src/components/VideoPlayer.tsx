"use client";
import React, { useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const [captionsUrl, setCaptionsUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCaptions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/transcribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ video_url: videoUrl }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.transcription) {
          const blob = new Blob([data.transcription], { type: 'text/vtt' });
          const url = URL.createObjectURL(blob);
          setCaptionsUrl(url);
        }
      } catch (error) {
        console.error('Error fetching captions:', error);
      }
    };

    getCaptions();
  }, [videoUrl]);

  return (
    <div className="video-player">
      <video width="100%" height="auto" controls>
        <source src={videoUrl} type="video/mp4" />
        {captionsUrl && (
          <track src={captionsUrl} kind="subtitles" srcLang="en" label="English" default />
        )}
        Your browser does not support the video tag.
      </video>
      <div>
        {captionsUrl && <p>Transcript: {captionsUrl}</p>}
      </div>
    </div>
  );
};

export default VideoPlayer;
