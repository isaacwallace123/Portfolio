import type { SeriesDef, TimePoint } from '@/components/ui/charts/types';
import parseSeriesKey from '@/components/ui/charts/utils/parseSeriesKey';
import { useMetrics } from '@/features/metrics/hooks/useMetrics';
import type { MetricKey } from '@/features/metrics/types/metrics.types';
import { useEffect, useMemo, useState } from 'react';

import TimeSeriesChart from './TimeSeriesChart';

type Props = {
  title?: string;
  subtitle?: string;
  series: SeriesDef[];
  maxPoints?: number;
  height?: number;
  yMin?: number;
  yMax?: number;
  timeWindowMs?: number;
  className?: string;

  unit?: string;
};

export default function LiveTimeSeriesChart({
  title,
  subtitle,
  series,
  maxPoints = 5_000,
  height = 240,
  yMin,
  yMax,
  timeWindowMs = 30_000,
  className = '',
  unit = '',
}: Props) {
  const { byServer, getSeries } = useMetrics();
  const [data, setData] = useState<TimePoint[]>([]);

  useEffect(() => {
    const keysToTrack = new Map<string, [string, MetricKey]>();
    for (const s of series) {
      const parsed = parseSeriesKey(s.key);
      if (parsed) keysToTrack.set(s.key, parsed);
    }

    const allPointsMap = new Map<number, Partial<Record<string, number>>>();
    for (const [key, [server, metric]] of keysToTrack) {
      const points = getSeries(server, metric);
      for (const point of points) {
        if (!allPointsMap.has(point.ts)) allPointsMap.set(point.ts, {});
        allPointsMap.get(point.ts)![key] = point.value;
      }
    }

    const merged: TimePoint[] = Array.from(allPointsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ts, values]) => ({ t: ts, ...values }))
      .slice(-maxPoints);

    setData(merged);
  }, [byServer, series, maxPoints, getSeries]);

  const now = Date.now();
  const visible = useMemo(
    () => data.filter(d => d.t >= now - timeWindowMs),
    [data, now, timeWindowMs]
  );

  const autoBounds = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const row of visible) {
      for (const s of series) {
        const v = row[s.key];
        if (typeof v === 'number' && !Number.isNaN(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }
    }
    if (!Number.isFinite(min) || !Number.isFinite(max))
      return { min: 0, max: 1 };

    const span = Math.max(1e-9, max - min);
    const pad = span * 0.1;
    return { min: min - pad, max: max + pad };
  }, [visible, series]);

  const effectiveMin = yMin ?? autoBounds.min;
  const effectiveMax = yMax ?? autoBounds.max;

  return (
    <TimeSeriesChart
      title={title}
      subtitle={subtitle}
      data={visible}
      series={series}
      height={height}
      yMin={effectiveMin}
      yMax={effectiveMax}
      className={className}
      unit={unit}
    />
  );
}
