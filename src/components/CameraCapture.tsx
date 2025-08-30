import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, X } from 'lucide-react';

interface CameraCaptureProps {
  onImageCapture: (imageData: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onImageCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        onImageCapture(imageData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
    onClose();
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="fixed inset-4 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Take Photo</h3>
        <Button variant="ghost" size="icon" onClick={stopCamera}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg shadow-lg"
            style={{ display: isStreaming ? 'block' : 'none' }}
          />
          
          {!isStreaming && (
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button 
          variant="scan" 
          size="lg" 
          onClick={capturePhoto}
          disabled={!isStreaming}
          className="w-full"
        >
          <Camera className="mr-2 h-5 w-5" />
          Capture Photo
        </Button>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Card>
  );
};