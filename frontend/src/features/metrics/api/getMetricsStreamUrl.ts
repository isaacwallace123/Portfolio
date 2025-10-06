import axiosInstance from '@/shared/api/axiosInstance';

const PATH = '/api/v1/metrics/live';

export function getMetricsStreamUrl(): string {
  const base = (axiosInstance.defaults?.baseURL as string | undefined)?.trim();

  if (!base) {
    throw new Error(
      '[CONFIG] VITE_BACKEND_URL is missing — cannot build metrics stream URL.'
    );
  }

  return new URL(PATH, base).toString();
}
