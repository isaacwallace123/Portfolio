import { Billboard, Text } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Mesh, Vector3 } from 'three';
import { useDepthFade } from '../../hooks/useDepthFade';

export type LabelBillboardProps = {
  position: [number, number, number];
  text: string;

  color?: string;
  fontSize?: number;
  fontUrl?: string;
  radialOffset?: number;

  opacity?: number;

  depthFade?: boolean;
  minOpacity?: number;
  fadeExponent?: number;
  center?: Vector3;

  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom' | 'top-baseline' | 'bottom-baseline';
  maxWidth?: number;
};

export default function LabelBillboard({
  position,
  text,
  color = '#cfcfcf',
  fontSize = 0.16,
  fontUrl,
  radialOffset = 0.14,

  opacity = 0.9,

  depthFade = false,
  minOpacity = 0.25,
  fadeExponent = 1.25,
  center,

  anchorX = 'left',
  anchorY = 'middle',
  maxWidth = 2,
}: LabelBillboardProps) {
  const worldPos = useMemo<[number, number, number]>(() => {
    const base = new Vector3(...position);
    return base
      .clone()
      .add(base.clone().normalize().multiplyScalar(radialOffset))
      .toArray() as [number, number, number];
  }, [position, radialOffset]);

  const textRef = useRef<Mesh | null>(null);

  useDepthFade(textRef, {
    enabled: depthFade,
    minOpacity,
    exponent: fadeExponent,
    baseOpacity: opacity,
    center,
  });

  return (
    <Billboard follow position={worldPos}>
      <Text
        ref={textRef}
        fontSize={fontSize}
        color={color}
        font={fontUrl}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
      >
        {text}
      </Text>
    </Billboard>
  );
}
