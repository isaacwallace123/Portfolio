import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import type { Group } from 'three';

export default function AutoRotateGroup({
  enabled,
  speed = 0.6,
  children,
}: {
  enabled: boolean;
  speed?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<Group | null>(null);
  useFrame((_, dt) => {
    if (enabled && ref.current) ref.current.rotation.y += speed * dt;
  });
  return <group ref={ref}>{children}</group>;
}
