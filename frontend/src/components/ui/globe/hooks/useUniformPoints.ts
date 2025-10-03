import { useMemo } from 'react';
import type { SkillItem, SkillPoint } from '../types';

export function useUniformPoints(skills: SkillItem[], radius: number) {
  const skillPoints = useMemo<SkillPoint[]>(() => {
    const n = skills.length;

    if (n === 0) return [];

    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts: SkillPoint[] = [];

    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1 || 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));

      const theta = golden * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      pts.push({
        pos: [x * (radius + 0.02), y * (radius + 0.02), z * (radius + 0.02)],
        latIdx: -1,
        lonIdx: -1,
        skill: skills[i],
      });
    }
    return pts;
  }, [skills, radius]);

  return { skillPoints };
}
