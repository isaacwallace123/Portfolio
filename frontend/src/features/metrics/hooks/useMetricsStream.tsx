import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  CurrentMetrics,
  MetricsStatus,
} from '@/features/metrics/types/metrics.types';

import { getMetricsStreamUrl } from '@/features/metrics/api';

export type UseMetricsSSEOptions = {
  url?: string;
  withCredentials?: boolean;
};

export type UseMetricsSSEReturn = {
  status: MetricsStatus;
  error: unknown;
  isConnected: boolean;
  last: CurrentMetrics | null;
  history: CurrentMetrics[];
  connect: () => void;
  disconnect: () => void;
};

export function useMetricsStream(
  opts: UseMetricsSSEOptions = {}
): UseMetricsSSEReturn {
  const { url = getMetricsStreamUrl() } = opts;

  const [status, setStatus] = useState<MetricsStatus>('idle');
  const [error, setError] = useState<unknown>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [last, setLast] = useState<CurrentMetrics | null>(null);
  const [history, setHistory] = useState<CurrentMetrics[]>([]);

  const esRef = useRef<EventSource | null>(null);

  const disconnect = useCallback(() => {
    if (esRef.current) {
      console.log('Closing EventSource connection');
      esRef.current.close();
      esRef.current = null;
    }
    setIsConnected(false);
    setStatus('closed');
  }, []);

  const connect = useCallback(() => {
    if (esRef.current) {
      disconnect();
    }

    console.log('Opening EventSource connection');
    setStatus('connecting');

    try {
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        console.log('EventSource opened');
        setIsConnected(true);
        setStatus('live');
        setError(null);
      };

      es.onmessage = (evt: MessageEvent) => {
        try {
          const snap: CurrentMetrics = JSON.parse(evt.data);
          setLast(snap);
          setHistory(prev => [...prev, snap]);
        } catch (e) {
          console.warn('SSE parse error:', e);
        }
      };
    } catch (e) {
      console.error('Failed to create EventSource:', e);
      setError(e);
      setStatus('error');
    }
  }, [url, disconnect]);

  useEffect(() => {
    connect();

    return () => {
      console.log('useMetricsStream cleanup');
      disconnect();
    };
  }, [connect, disconnect]);

  return { status, error, isConnected, last, history, connect, disconnect };
}
