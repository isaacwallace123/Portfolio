import { useMemo } from 'react';
import { latLonToVec3 } from '../utils/math';

export function useGrid(
  latExtent: number,
  latStep: number,
  lonStep: number,
  radius: number
) {
  const latValues = useMemo(() => {
    const arr: number[] = [];

    for (let lat = -latExtent; lat <= latExtent; lat += latStep) arr.push(lat);

    return arr;
  }, [latExtent, latStep]);

  const lonValues = useMemo(() => {
    const arr: number[] = [];

    for (let lon = -180; lon < 180; lon += lonStep) arr.push(lon);

    return arr;
  }, [lonStep]);

  const latCount = latValues.length;
  const lonCount = lonValues.length;

  const gridPoints = useMemo(() => {
    const out: {
      pos: [number, number, number];
      latIdx: number;
      lonIdx: number;
    }[] = [];

    for (let i = 0; i < latCount; i++) {
      for (let j = 0; j < lonCount; j++) {
        const p = latLonToVec3(
          latValues[i],
          lonValues[j],
          radius + 0.02
        ).toArray() as [number, number, number];

        out.push({ pos: p, latIdx: i, lonIdx: j });
      }
    }

    return out;
  }, [latValues, lonValues, latCount, lonCount, radius]);

  return { latValues, lonValues, latCount, lonCount, gridPoints };
}
