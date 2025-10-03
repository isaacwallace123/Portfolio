import { Billboard, Image } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useDepthFade } from '../../hooks/useDepthFade';

type IconBillboardProps = {
  position: [number, number, number];
  url: string;
  size?: number;
  offset?: number;
  opacity?: number;
  alwaysOnTop?: boolean;

  depthFade?: boolean;
  minOpacity?: number;
  fadeExponent?: number;
};

export default function IconBillboard({
  position,
  url,
  size = 0.22,
  offset = 0.16,
  opacity = 1,
  alwaysOnTop = false,

  depthFade = false,
  minOpacity = 0.25,
  fadeExponent = 1.25,
}: IconBillboardProps) {
  const worldPos = useMemo<[number, number, number]>(() => {
    const base = new Vector3(...position);
    return base
      .clone()
      .add(base.clone().normalize().multiplyScalar(offset))
      .toArray() as [number, number, number];
  }, [position, offset]);

  const meshRef = useRef<Mesh | null>(null);

  useDepthFade(meshRef, {
    enabled: depthFade,
    minOpacity,
    exponent: fadeExponent,
    baseOpacity: opacity,
  });

  return (
    <Billboard follow position={worldPos}>
      <Image
        ref={meshRef}
        url={url}
        scale={[size, size]}
        toneMapped={false}
        transparent
        opacity={opacity}
        renderOrder={alwaysOnTop ? 999 : 0}
        {...(alwaysOnTop
          ? { 'material-transparent': true, 'material-depthTest': false }
          : {})}
      />
    </Billboard>
  );
}
