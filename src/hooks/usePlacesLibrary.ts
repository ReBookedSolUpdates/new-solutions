import { useState, useEffect } from "react";

interface UsePlacesLibraryResult {
  isLoaded: boolean;
  error: string | null;
}

export default function usePlacesLibrary(): UsePlacesLibraryResult {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => {
      if (window.google?.maps?.places) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (check()) return;

    // Poll for availability
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (check() || attempts > 50) {
        clearInterval(interval);
        if (attempts > 50 && !window.google?.maps?.places) {
          setError("Google Places library failed to load");
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return { isLoaded, error };
}
