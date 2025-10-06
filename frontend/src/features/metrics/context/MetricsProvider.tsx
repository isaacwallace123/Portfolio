import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getCurrentMetrics } from '@/features/metrics/api/getCurrentMetrics';
import { getMetricsHistory } from '@/features/metrics/api/getMetricsHistory';
import { useMetricsStream } from '@/features/metrics/hooks/useMetricsStream';

import { getMetricsStreamUrl } from '@/features/metrics/api';

import toHistorySeries from '@/features/metrics/utils/toHistorySeries';

import { MetricsContext } from './MetricsContext';

import type {
  CurrentMetrics,
  HistoryQuery,
  HistorySeries,
  MetricKey,
  SeriesKey,
  SeriesPoint,
} from '@/features/metrics/types/metrics.types';

const METRICS: readonly MetricKey[] = [
  'cpu_pct',
  'mem_pct',
  'net_mbps',
  'uptime',
] as const;
const MAX_POINTS = 180;

const MetricsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { status, error, last, connect, disconnect } = useMetricsStream({
    url: getMetricsStreamUrl(),
    withCredentials: false,
  });

  const [byServer, setByServer] = useState<
    Map<string, Partial<Record<MetricKey, SeriesPoint[]>>>
  >(new Map());
  const [lastByKey, setLastByKey] = useState<
    Map<SeriesKey, SeriesPoint | undefined>
  >(new Map());
  const [current, setCurrent] = useState<CurrentMetrics | null>(null);
  const [history, setHistory] = useState<HistorySeries | null>(null);

  useEffect(() => {
    if (!last) return;

    const ts = Date.now();
    const nextByServer = new Map(byServer);
    const nextLastByKey = new Map(lastByKey);

    for (const [server, vals] of Object.entries(last)) {
      const serverEntry = { ...(nextByServer.get(server) ?? {}) };

      for (const metric of METRICS) {
        const value = vals[metric];
        if (typeof value !== 'number') continue;

        const key: SeriesKey = `${server}:${metric}`;
        const point: SeriesPoint = { ts, value };

        const existingPoints = serverEntry[metric] ?? [];
        serverEntry[metric] = [...existingPoints, point].slice(-MAX_POINTS);

        nextLastByKey.set(key, point);
      }

      nextByServer.set(server, serverEntry);
    }

    setByServer(nextByServer);
    setLastByKey(nextLastByKey);
    setCurrent(last);
  }, [last]);

  const refreshCurrent = useCallback(async () => {
    try {
      const snap = await getCurrentMetrics();
      setCurrent(snap);
    } catch (e) {
      console.error('Failed to fetch current metrics:', e);
    }
  }, []);

  const loadHistory = useCallback(async (q: HistoryQuery) => {
    try {
      const arr = await getMetricsHistory(q.from, q.to);
      setHistory(toHistorySeries(arr));
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  useEffect(() => {
    refreshCurrent();
  }, [refreshCurrent]);

  const servers = useMemo(
    () =>
      Array.from(new Set([...byServer.keys(), ...Object.keys(current ?? {})])),
    [byServer, current]
  );

  const series = useMemo(() => {
    const result: Array<{
      server: string;
      metric: MetricKey;
      points: SeriesPoint[];
    }> = [];

    for (const [server, metrics] of byServer) {
      for (const metric of METRICS) {
        const points = metrics[metric];
        if (points && points.length > 0) {
          result.push({ server, metric, points });
        }
      }
    }

    return result;
  }, [byServer]);

  const getLast = useCallback(
    (server: string, metric: MetricKey): SeriesPoint | undefined =>
      lastByKey.get(`${server}:${metric}`),
    [lastByKey]
  );

  const getSeries = useCallback(
    (server: string, metric: MetricKey): SeriesPoint[] =>
      byServer.get(server)?.[metric] ?? [],
    [byServer]
  );

  const getServerMetric = useCallback(
    (server: string, metric: MetricKey): number | null => {
      const liveValue = getLast(server, metric)?.value;

      if (liveValue !== undefined) return liveValue;

      return current?.[server]?.[metric] ?? null;
    },
    [getLast, current]
  );

  const value = useMemo(
    () => ({
      status,
      error,
      series,
      byServer,
      lastByKey,
      current,
      history,
      refreshCurrent,
      loadHistory,
      connect,
      disconnect,
      servers,
      getLast,
      getSeries,
      getServerMetric,
    }),
    [
      status,
      error,
      series,
      byServer,
      lastByKey,
      current,
      history,
      refreshCurrent,
      loadHistory,
      connect,
      disconnect,
      servers,
      getLast,
      getSeries,
      getServerMetric,
    ]
  );

  return (
    <MetricsContext.Provider value={value}>{children}</MetricsContext.Provider>
  );
};

export default MetricsProvider;
