import { useMemo } from 'react';
import type { SkillItem, SkillPoint } from '../types';

export function useSkillPoints(
  gridPoints: {
    pos: [number, number, number];
    latIdx: number;
    lonIdx: number;
  }[],
  skills: SkillItem[]
) {
  const skillPoints = useMemo<SkillPoint[]>(() => {
    const total = gridPoints.length;
    const n = Math.max(0, Math.min(skills.length, total));

    if (n === 0) return [];

    const step = Math.floor(total / n);
    const result: SkillPoint[] = [];

    let idx = 0;

    for (let i = 0; i < n; i++) {
      const gp = gridPoints[idx];

      result.push({ ...gp, skill: skills[i] });

      idx = (idx + step) % total;
    }
    return result;
  }, [gridPoints, skills]);

  const occupied = useMemo(() => {
    const m = new Map<string, { pos: [number, number, number] }>();

    for (const s of skillPoints)
      m.set(`${s.latIdx},${s.lonIdx}`, { pos: s.pos });

    return m;
  }, [skillPoints]);

  return { skillPoints, occupied };
}
