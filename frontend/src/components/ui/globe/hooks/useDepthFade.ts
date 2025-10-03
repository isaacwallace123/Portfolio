import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import { Material, MathUtils, Object3D, Vector3 } from 'three';

type WithMaterial = Object3D & {
  material?: Material | Material[];
};

export type DepthFadeOptions = {
  enabled?: boolean;
  minOpacity?: number;
  exponent?: number;
  baseOpacity?: number;
  center?: Vector3;
};

export function applyOpacity(target: WithMaterial, alpha: number): void {
  const set = (m: Material) => {
    m.transparent = true;
    m.depthWrite = false;
    m.opacity = alpha;
  };

  const mat = target.material;

  if (Array.isArray(mat)) mat.forEach(set);
  else if (mat) set(mat);
}

export function useDepthFade<T extends WithMaterial>(
  ref: React.RefObject<T | null>,
  {
    enabled = true,
    minOpacity = 0.25,
    exponent = 1.25,
    baseOpacity = 1,
    center,
  }: DepthFadeOptions = {}
) {
  const origin = useMemo(() => center ?? new Vector3(0, 0, 0), [center]);
  const tmp = useMemo(() => new Vector3(), []);

  useFrame(({ camera }) => {
    const obj = ref.current;

    if (!enabled || !obj) return;

    obj.getWorldPosition(tmp);

    const camToCenter = camera.position.distanceTo(origin);
    const rEff = tmp.distanceTo(origin);

    const minD = Math.max(1e-4, camToCenter - rEff);
    const maxD = camToCenter + rEff;

    const d = camera.position.distanceTo(tmp);

    let t = MathUtils.clamp((d - minD) / (maxD - minD), 0, 1);

    if (exponent !== 1) t = Math.pow(t, exponent);

    const alpha = baseOpacity * MathUtils.lerp(1, minOpacity, t);

    applyOpacity(obj, alpha);
  });
}
