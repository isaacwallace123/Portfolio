import { useBreakpoint } from './useBreakpoint';

type Inputs = {
  height: number;
  radiusScale: number;
  cameraPadding: number;
  iconSize: number;
  iconOffset: number;
  fontSize: number;
  dotRadius: number;
  neighbors: number;
  lineOpacity: number;
};

export function useGlobeResponsive(i: Inputs) {
  const { isSM, isMD } = useBreakpoint();
  const isMobile = isSM;

  const radiusScale = isMobile ? 0.67 : isMD ? 0.84 : i.radiusScale;
  const cameraPadding = isMobile ? 1.34 : i.cameraPadding;
  const height = isMobile ? 320 : isMD ? Math.min(i.height, 420) : i.height;

  const iconSize = isMobile ? i.iconSize * 0.88 : i.iconSize;
  const iconOffset = isMobile ? i.iconOffset * 0.88 : i.iconOffset;

  const fontSize = isMobile ? 0.082 : isMD ? 0.095 : i.fontSize;
  const dotRadius = isMobile ? 0.02 : i.dotRadius;

  const neighbors = isMobile
    ? Math.max(2, Math.min(3, i.neighbors))
    : i.neighbors;
  const lineOpacity = isMobile ? Math.min(0.26, i.lineOpacity) : i.lineOpacity;

  const dpr: [number, number] = isMobile ? [1, 1.3] : [1, 2];

  return {
    isMobile,
    isMD,

    height,
    radiusScale,
    cameraPadding,

    iconSize,
    iconOffset,

    fontSize,
    dotRadius,

    neighbors,
    lineOpacity,

    dpr,
  };
}
