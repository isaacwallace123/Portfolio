export type SkillItem = { label: string; color?: string; icon?: string };

export type SkillPoint = {
  pos: [number, number, number];
  latIdx: number;
  lonIdx: number;
  skill: SkillItem;
};

export type GridSpec = {
  latStep: number;
  lonStep: number;
  latExtent?: number;
  radius?: number;
};

export const ConnectionMode = {
  None: 'none',
  Nearest: 'nearest',
  Adjacent: 'adjacent',
  Ring: 'ring',
  All: 'all',
} as const;
export type ConnectionMode =
  (typeof ConnectionMode)[keyof typeof ConnectionMode];

export const LayoutMode = {
  Uniform: 'uniform',
  Grid: 'grid',
} as const;
export type LayoutMode = (typeof LayoutMode)[keyof typeof LayoutMode];

export const EdgeStyle = {
  Arc: 'arc',
  Straight: 'straight',
} as const;
export type EdgeStyle = (typeof EdgeStyle)[keyof typeof EdgeStyle];

export const CONNECTION_MODES = Object.values(
  ConnectionMode
) as readonly ConnectionMode[];
export const LAYOUT_MODES = Object.values(LayoutMode) as readonly LayoutMode[];
export const EDGE_STYLES = Object.values(EdgeStyle) as readonly EdgeStyle[];
