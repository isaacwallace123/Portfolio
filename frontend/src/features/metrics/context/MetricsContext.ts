import type {
  CurrentMetrics,
  HistoryQuery,
  HistorySeries,
  MetricKey,
  SeriesPoint,
} from '@/features/metrics/types/metrics.types';
import { createContext } from 'react';

type SeriesKey = `${string}:${MetricKey}`;

export type MetricsContextValue = {
  status: 'idle' | 'connecting' | 'live' | 'reconnecting' | 'closed' | 'error';
  error: unknown;

  series: Array<{ server: string; metric: MetricKey; points: SeriesPoint[] }>;
  byServer: Map<string, Partial<Record<MetricKey, SeriesPoint[]>>>;
  lastByKey: Map<SeriesKey, SeriesPoint | undefined>;

  current: CurrentMetrics | null;
  history: HistorySeries | null;

  refreshCurrent: () => Promise<void>;
  loadHistory: (q: HistoryQuery) => Promise<void>;
  connect: () => void;
  disconnect: () => void;

  servers: string[];
  getLast: (server: string, metric: MetricKey) => SeriesPoint | undefined;
  getSeries: (server: string, metric: MetricKey) => SeriesPoint[];
  getServerMetric: (server: string, metric: MetricKey) => number | null;
};

export const MetricsContext = createContext<MetricsContextValue | null>(null);
