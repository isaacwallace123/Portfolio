export interface SeriesPoint {
  ts: number;
  value: number;
}

export type MetricKey = 'cpu_pct' | 'mem_pct' | 'net_mbps' | 'uptime';

export const MetricType = {
  cpu: 'cpu_pct',
  mem: 'mem_pct',
  net: 'net_mbps',
  up: 'uptime',
} as const;

export type MetricType = (typeof MetricType)[keyof typeof MetricType];

export type CurrentMetrics = Record<
  string,
  {
    cpu_pct: number;
    mem_pct: number;
    net_mbps: number;
    uptime: number;
  }
>;

export interface MetricSeries {
  server: string;
  metric: MetricKey;
  points: SeriesPoint[];
}

export interface MetricsHistoryResponse {
  start: number;
  end: number;
  interval: number;
  series: MetricSeries[];
}

export interface MetricsStreamEvent {
  server: string;
  metric: MetricKey;
  ts: number;
  value: number;
}

export type MetricsStatus =
  | 'idle'
  | 'connecting'
  | 'live'
  | 'reconnecting'
  | 'closed'
  | 'error';

export interface HistoryQuery {
  from: number;
  to: number;
  servers?: string[];
  metrics?: MetricKey[];
}

export type HistorySeries = Record<
  string,
  Partial<Record<MetricKey, SeriesPoint[]>>
>;

export type SeriesKey = `${string}:${MetricKey}`;
