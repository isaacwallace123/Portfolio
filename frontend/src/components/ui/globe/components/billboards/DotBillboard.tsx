import { Billboard } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useDepthFade } from '../../hooks/useDepthFade';

export type DotBillboardProps = {
  position: [number, number, number];

  color?: string;
  radius?: number;
  radialOffset?: number;
  localOffset?: [number, number, number];

  opacity?: number;

  depthFade?: boolean;
  minOpacity?: number;
  fadeExponent?: number;
  center?: Vector3;
};

export default function DotBillboard({
  position,
  color = '#cfcfcf',
  radius = 0.025,
  radialOffset = 0.14,
  localOffset = [0, 0, 0],

  opacity = 0.9,

  depthFade = false,
  minOpacity = 0.25,
  fadeExponent = 1.25,
  center,
}: DotBillboardProps) {
  const worldPos = useMemo<[number, number, number]>(() => {
    const base = new Vector3(...position);
    return base
      .clone()
      .add(base.clone().normalize().multiplyScalar(radialOffset))
      .toArray() as [number, number, number];
  }, [position, radialOffset]);

  const dotRef = useRef<Mesh | null>(null);

  useDepthFade(dotRef, {
    enabled: depthFade,
    minOpacity,
    exponent: fadeExponent,
    baseOpacity: opacity,
    center,
  });

  return (
    <Billboard follow position={worldPos}>
      <mesh ref={dotRef} position={localOffset}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Billboard>
  );
}
