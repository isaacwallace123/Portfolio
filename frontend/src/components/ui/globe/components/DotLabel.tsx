import { Billboard, Text } from '@react-three/drei';
import React from 'react';
import { Vector3 } from 'three';

type Props = {
  position: [number, number, number];
  label: string;
  color?: string;
  dotRadius?: number;
  fontSize?: number;
  showDot?: boolean;
  fontUrl?: string;
  radialOffset?: number;
};

export default function DotLabel({
  position,
  label,
  color = '#e5e7eb',
  dotRadius = 0.03,
  fontSize = 0.1,
  showDot = true,
  fontUrl,
  radialOffset = 0,
}: Props) {
  const labelOffset = React.useMemo(() => {
    if (!radialOffset) return [0, 0, 0] as [number, number, number];
    const v = new Vector3(...position).normalize().multiplyScalar(radialOffset);
    return v.toArray() as [number, number, number];
  }, [position, radialOffset]);

  return (
    <group position={position}>
      {showDot && (
        <mesh>
          <sphereGeometry args={[dotRadius, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.4}
          />
        </mesh>
      )}

      <Billboard follow position={labelOffset}>
        <Text
          font={fontUrl}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#000000"
          material-toneMapped={false}
          renderOrder={999}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
}
