import { useEffect } from 'react';

export const useRealViewport = (): void => {
  useEffect(() => {
    const setRealViewportHeight = (): void => {
      const vh: number = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setRealViewportHeight();
    
    window.addEventListener('resize', setRealViewportHeight);
    window.addEventListener('orientationchange', setRealViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setRealViewportHeight);
      window.removeEventListener('orientationchange', setRealViewportHeight);
    };
  }, []);
};
