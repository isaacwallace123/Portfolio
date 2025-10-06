import { getMetricsStreamUrl } from '@/features/metrics/api/getMetricsStreamUrl';
import type {
  MetricKey,
  MetricsStreamEvent,
  SeriesPoint as Point,
} from '@/features/metrics/types/metrics.types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SeriesKey = `${string}:${MetricKey}`;
function keyOf(server: string, metric: MetricKey): SeriesKey {
  return `${server}:${metric}`;
}

type UseMetricsStreamOptions = {
  maxPoints?: number;
  autoStart?: boolean;
  url?: string;
  maxBackoffMs?: number;
};

type StreamStatus =
  | 'idle'
  | 'connecting'
  | 'live'
  | 'reconnecting'
  | 'closed'
  | 'error';

export function useMetricsStream(opts: UseMetricsStreamOptions = {}) {
  const {
    maxPoints = 180,
    autoStart = true,
    url = getMetricsStreamUrl(),
    maxBackoffMs = 30_000,
  } = opts;

  const [status, setStatus] = useState<StreamStatus>(
    autoStart ? 'connecting' : 'idle'
  );

  const [error, setError] = useState<unknown>(null);

  const seriesRef = useRef(
    new Map<SeriesKey, { server: string; metric: MetricKey; points: Point[] }>()
  );

  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick(t => (t + 1) % 1_000_000), []);

  const esRef = useRef<EventSource | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const backoffRef = useRef(1_000);
  const closedRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  const appendPoint = useCallback(
    (e: MetricsStreamEvent) => {
      const k = keyOf(e.server, e.metric);
      const found = seriesRef.current.get(k) ?? {
        server: e.server,
        metric: e.metric,
        points: [] as Point[],
      };

      found.points.push({ ts: e.ts, value: e.value });

      if (found.points.length > maxPoints) {
        found.points.splice(0, found.points.length - maxPoints);
      }

      seriesRef.current.set(k, found);
    },
    [maxPoints]
  );

  const scheduleReconnect = useCallback(() => {
    const delay = Math.min(backoffRef.current, maxBackoffMs);
    const next = Math.min(backoffRef.current * 2, maxBackoffMs);

    backoffRef.current = next;

    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    reconnectTimerRef.current = window.setTimeout(() => {
      reconnectTimerRef.current = null;
      if (!closedRef.current && !esRef.current) connectRef.current();
    }, delay);
  }, [maxBackoffMs]);

  const connect = useCallback(() => {
    if (esRef.current) return;

    closedRef.current = false;

    setStatus(s => (s === 'idle' || s === 'closed' ? 'connecting' : s));

    try {
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        setStatus('live');
        setError(null);
        backoffRef.current = 1_000;
      };

      es.onmessage = ev => {
        try {
          const data: MetricsStreamEvent = JSON.parse(ev.data);

          appendPoint(data);

          bump();
        } catch {
          /* ignore malformed frames */
        }
      };

      es.onerror = () => {
        es.close();
        esRef.current = null;

        if (closedRef.current) {
          setStatus('closed');
          return;
        }
        setStatus('reconnecting');
        scheduleReconnect();
      };
    } catch (e) {
      setError(e);
      setStatus('error');
    }
  }, [url, appendPoint, bump, scheduleReconnect]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    closedRef.current = true;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    setStatus('closed');
  }, []);

  useEffect(() => {
    if (autoStart) connect();
    return () => {
      closedRef.current = true;
      if (esRef.current) esRef.current.close();
      if (reconnectTimerRef.current)
        window.clearTimeout(reconnectTimerRef.current);
    };
  }, [autoStart, connect]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const series = useMemo(() => Array.from(seriesRef.current.values()), [tick]);

  const byServer = useMemo(() => {
    const map = new Map<string, Record<MetricKey, Point[]>>();
    for (const s of series) {
      const entry = map.get(s.server) ?? {
        cpu_pct: [],
        mem_pct: [],
        net_mbps: [],
        uptime: [],
      };
      entry[s.metric] = s.points;
      map.set(s.server, entry);
    }
    return map;
  }, [series]);

  const lastByKey = useMemo(() => {
    const out = new Map<SeriesKey, Point | undefined>();
    for (const s of series) out.set(keyOf(s.server, s.metric), s.points.at(-1));
    return out;
  }, [series]);

  return { status, error, series, byServer, lastByKey, connect, disconnect };
}
