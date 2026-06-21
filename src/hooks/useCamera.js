import { useCallback, useRef, useState } from 'react';

const useCamera = () => {
  const [error, setError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }

      setIsCameraActive(true);
    } catch (err) {
      stopCamera();

      if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError(err.message || 'Unable to start camera.');
      }
    }
  }, [stopCamera]);

  const captureImage = useCallback(() => {
    const video = videoRef.current;

    if (!video || !isCameraActive || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg', 0.85);
  }, [isCameraActive]);

  return {
    startCamera,
    stopCamera,
    captureImage,
    videoRef,
    isCameraActive,
    error,
    setError
  };
};

export default useCamera;
