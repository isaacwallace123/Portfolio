import axiosInstance from '@/shared/api/axiosInstance';

const PATH = '/api/v1/metrics/live';

export function getMetricsStreamUrl(): string {
  const base =
    (axiosInstance.defaults?.baseURL as string | undefined)?.trim() ||
    window.location.origin;

  return new URL(PATH, base).toString();
}
