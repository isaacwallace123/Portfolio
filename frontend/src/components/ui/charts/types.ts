export type SeriesDef = {
  key: string;
  label: string;
  color?: string;
  unit?: 'ms' | '%' | 'bytes' | 'none';
  hidden?: boolean;
};

export type TimePoint = {
  t: number;
  [seriesKey: string]: number;
};

export type CategoryDatum = {
  name: string;
  value: number;
};
