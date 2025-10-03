import { useGrid } from './useGrid';
import { useSkillPoints } from './useSkillPoints';
import { useUniformPoints } from './useUniformPoints';
import { LayoutMode, type SkillItem } from '../types';

export function useGlobeData({
  layout,
  latExtent,
  latStep,
  lonStep,
  radius,
  skills,
}: {
  layout: LayoutMode;
  latExtent: number;
  latStep: number;
  lonStep: number;
  radius: number;
  skills: SkillItem[];
}) {
  const gridData = useGrid(latExtent, latStep, lonStep, radius);
  const gridMapped = useSkillPoints(gridData.gridPoints, skills);
  const uniform = useUniformPoints(skills, radius);

  const isGridLayout = layout === LayoutMode.Grid;

  const skillPoints = isGridLayout
    ? gridMapped.skillPoints
    : uniform.skillPoints;
  const occupied = isGridLayout ? gridMapped.occupied : undefined;
  const latCount = isGridLayout ? gridData.latCount : 0;
  const lonCount = isGridLayout ? gridData.lonCount : 0;

  return { skillPoints, occupied, latCount, lonCount };
}
