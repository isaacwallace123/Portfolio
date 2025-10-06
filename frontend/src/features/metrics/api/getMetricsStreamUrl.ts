import axiosInstance from '@/shared/api/axiosInstance';

export function getMetricsStreamUrl(): string {
  return `${axiosInstance.getUri()}api/v1/metrics/live`;
}
