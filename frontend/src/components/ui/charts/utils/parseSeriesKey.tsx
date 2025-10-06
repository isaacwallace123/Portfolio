import type { MetricKey } from '@/features/metrics/types/metrics.types';

export default function parseSeriesKey(
  key: string
): [string, MetricKey] | null {
  const parts = key.split(':');
  if (parts.length !== 2) return null;

  const [server, metric] = parts;
  const validMetrics: MetricKey[] = [
    'cpu_pct',
    'mem_pct',
    'net_mbps',
    'uptime',
  ];

  if (validMetrics.includes(metric as MetricKey)) {
    return [server, metric as MetricKey];
  }

  return null;
}
