import { useState, useEffect, useCallback } from "react";

export const useUserMedia = (constraints) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const getUserMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (e) {
      setError(e);
    }
  }, [constraints]);

  useEffect(() => {
    if (!stream) {
      getUserMedia();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream, getUserMedia]);

  return { stream, error };
};
