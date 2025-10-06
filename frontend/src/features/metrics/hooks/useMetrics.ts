import {
  MetricsContext,
  type MetricsContextValue,
} from '@/features/metrics/context/MetricsContext';
import { useContext } from 'react';

export function useMetrics(): MetricsContextValue {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error('useMetrics must be used within <MetricsProvider>');
  return ctx;
}
