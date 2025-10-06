import axiosInstance from '@/shared/api/axiosInstance';

import type { MetricsHistoryResponse } from '../types/metrics.types';

export async function getMetricsHistory(
  start?: number,
  end?: number
): Promise<MetricsHistoryResponse[]> {
  try {
    const res = await axiosInstance.get<MetricsHistoryResponse[]>(
      '/metrics/history',
      {
        params: { start, end },
      }
    );

    console.log(res.data);

    return res.data;
  } catch (err) {
    console.error(err);

    throw err;
  }
}
