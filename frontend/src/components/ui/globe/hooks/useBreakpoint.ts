import { useEffect, useState } from 'react';

export function useBreakpoint() {
  const [w, setW] = useState<number>(
    typeof window === 'undefined' ? 1200 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    width: w,
    isXS: w < 380,
    isSM: w < 640,
    isMD: w < 1024,
  };
}
