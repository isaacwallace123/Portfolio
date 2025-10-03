import { Billboard, Image } from '@react-three/drei';
import React from 'react';
import { Vector3 } from 'three';

type IconBillboardProps = {
  position: [number, number, number];
  url: string;
  size?: number;
  offset?: number;
  opacity?: number;
  alwaysOnTop?: boolean;
};

export default function IconBillboard({
  position,
  url,
  size = 0.22,
  offset = 0.16,
  opacity = 1,
  alwaysOnTop = false,
}: IconBillboardProps) {
  const worldPos = React.useMemo(() => {
    const base = new Vector3(...position);
    return base
      .clone()
      .add(base.clone().normalize().multiplyScalar(offset))
      .toArray() as [number, number, number];
  }, [position, offset]);

  return (
    <Billboard follow position={worldPos}>
      <Image
        url={url}
        scale={[size, size]}
        transparent
        opacity={opacity}
        toneMapped={false}
        renderOrder={alwaysOnTop ? 999 : 0}
        {...(alwaysOnTop
          ? { 'material-transparent': true, 'material-depthTest': false }
          : {})}
      />
    </Billboard>
  );
}
