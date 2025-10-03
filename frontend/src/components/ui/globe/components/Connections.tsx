import { useMemo } from 'react';
import { BufferGeometry, Group, Line, LineBasicMaterial, Vector3 } from 'three';
import {
  ConnectionMode as connectionMode,
  EdgeStyle,
  type ConnectionMode,
  type SkillPoint,
} from '../types';
import { arcGeometry } from '../utils/math';

type Props = {
  skillPoints: SkillPoint[];
  occupied?: Map<string, { pos: [number, number, number] }>;
  latCount?: number;
  lonCount?: number;
  radius: number;
  mode: ConnectionMode;
  neighbors: number;
  arcLift: number;
  lineColor: string;
  lineOpacity: number;
  colorFn?: (a: SkillPoint, b: SkillPoint) => string | undefined;
  edgeStyle?: EdgeStyle;
};

export default function Connections({
  skillPoints,
  occupied,
  latCount,
  lonCount,
  radius,
  mode,
  neighbors,
  arcLift,
  lineColor,
  lineOpacity,
  colorFn,
  edgeStyle = EdgeStyle.Arc,
}: Props) {
  const group = useMemo(() => {
    if (mode === connectionMode.None || skillPoints.length < 2) return null;

    const effectiveMode: ConnectionMode =
      mode === connectionMode.Adjacent && (!occupied || !latCount || !lonCount)
        ? connectionMode.Nearest
        : mode;

    const g = new Group();

    const baseParams = {
      transparent: true,
      opacity: lineOpacity,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    } as const;

    const baseMat = new LineBasicMaterial({ color: lineColor, ...baseParams });

    const materialForPair = (ai?: number, bi?: number) => {
      if (colorFn && ai != null && bi != null) {
        const c = colorFn(skillPoints[ai], skillPoints[bi]);

        if (c) return new LineBasicMaterial({ color: c, ...baseParams });
      }
      return baseMat;
    };

    const addEdge = (ai: number, bi: number) => {
      const a = skillPoints[ai].pos;
      const b = skillPoints[bi].pos;

      let geom: BufferGeometry;

      if (edgeStyle === EdgeStyle.Straight) {
        const pa = new Vector3(...a).setLength(radius + arcLift);
        const pb = new Vector3(...b).setLength(radius + arcLift);

        geom = new BufferGeometry().setFromPoints([pa, pb]);
      } else {
        geom = arcGeometry(a, b, radius + arcLift, 28);
      }

      g.add(new Line(geom, materialForPair(ai, bi)));
    };

    if (effectiveMode === connectionMode.Adjacent) {
      const indexByCell = new Map<string, number>();

      skillPoints.forEach((sp, i) =>
        indexByCell.set(`${sp.latIdx},${sp.lonIdx}`, i)
      );

      const Lats = latCount!;
      const Lons = lonCount!;

      const drawn = new Set<string>();

      const tryAdd = (i1: number, j1: number, i2: number, j2: number) => {
        const aIdx = indexByCell.get(`${i1},${j1}`);
        const bIdx = indexByCell.get(`${i2},${j2}`);

        if (aIdx == null || bIdx == null) return;

        const key =
          i1 + j1 / 1e6 < i2 + j2 / 1e6
            ? `${i1},${j1}-${i2},${j2}`
            : `${i2},${j2}-${i1},${j1}`;
        if (drawn.has(key)) return;

        drawn.add(key);

        addEdge(aIdx, bIdx);
      };

      for (const s of skillPoints) {
        const i = s.latIdx;
        const j = s.lonIdx;

        tryAdd(i, j, i, (j + 1) % Lons); // east

        tryAdd(i, j, i, (j - 1 + Lons) % Lons); // west

        if (i + 1 < Lats) tryAdd(i, j, i + 1, j); // south

        if (i - 1 >= 0) tryAdd(i, j, i - 1, j); // north
      }
    } else if (effectiveMode === connectionMode.Nearest) {
      const drawn = new Set<string>();

      const k = Math.max(1, neighbors);

      skillPoints.forEach((a, ai) => {
        const av = new Vector3(...a.pos).normalize();

        const ranked = skillPoints
          .map((b, bi) => {
            if (ai === bi) return { bi, ang: Number.POSITIVE_INFINITY };

            const bv = new Vector3(...b.pos).normalize();

            const dot = Math.min(1, Math.max(-1, av.dot(bv)));

            return { bi, ang: Math.acos(dot) };
          })
          .sort((x, y) => x.ang - y.ang);

        const maxLinks = Math.min(k, skillPoints.length - 1);
        for (let t = 0; t < maxLinks; t++) {
          const bi = ranked[t].bi;
          const key = ai < bi ? `${ai}-${bi}` : `${bi}-${ai}`;

          if (drawn.has(key)) continue;

          drawn.add(key);

          addEdge(ai, bi);
        }
      });
    } else if (effectiveMode === connectionMode.Ring) {
      for (let i = 0; i < skillPoints.length; i++) {
        addEdge(i, (i + 1) % skillPoints.length);
      }
    } else if (effectiveMode === connectionMode.All) {
      for (let i = 0; i < skillPoints.length; i++) {
        for (let j = i + 1; j < skillPoints.length; j++) addEdge(i, j);
      }
    }

    return g;
  }, [
    mode,
    skillPoints,
    lineColor,
    lineOpacity,
    radius,
    arcLift,
    occupied,
    lonCount,
    latCount,
    neighbors,
    colorFn,
    edgeStyle,
  ]);

  if (!group) return null;

  return <primitive object={group} />;
}
