import type {
  HistorySeries,
  MetricsHistoryResponse,
} from '@/features/metrics/types/metrics.types';

export default function toHistorySeries(
  res: MetricsHistoryResponse[]
): HistorySeries {
  const out: HistorySeries = {};

  for (const bucket of res) {
    for (const s of bucket.series) {
      if (!out[s.server]) out[s.server] = {};
      out[s.server]![s.metric] = s.points;
    }
  }

  return out;
}
