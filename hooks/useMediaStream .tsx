import { useCallback, useState } from "react";

export  const useMediaStream = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setHasCamera(videoDevices.length > 0);
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };
  
    const startVideoStream = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        };
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(mediaStream);
        return mediaStream;
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCamera(false);
        return null;
      }
    };
  
    const stopVideoStream = useCallback(() => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }, [stream]);
  
    return {
      stream,
      hasCamera,
      checkCameraAvailability,
      startVideoStream,
      stopVideoStream
    };
  };

