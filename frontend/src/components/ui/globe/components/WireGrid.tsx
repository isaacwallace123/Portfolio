import { useMemo } from 'react';
import { Group, Line, LineBasicMaterial } from 'three';
import { buildMeridian, buildParallel } from '../utils/math';

type Props = {
  radius: number;
  latStep: number;
  lonStep: number;
  latExtent: number;
};

export default function WireGrid({
  radius,
  latStep,
  lonStep,
  latExtent,
}: Props) {
  const baseLines = useMemo(() => {
    const group = new Group();

    const mat = new LineBasicMaterial({
      color: '#2a2a2a',
      transparent: true,
      opacity: 0.55,
    });

    for (let lat = -latExtent; lat <= latExtent; lat += latStep) {
      group.add(new Line(buildParallel(lat, radius), mat));
    }

    for (let lon = -180; lon < 180; lon += lonStep) {
      group.add(new Line(buildMeridian(lon, radius), mat));
    }

    return group;
  }, [radius, latStep, lonStep, latExtent]);

  return <primitive object={baseLines} />;
}
