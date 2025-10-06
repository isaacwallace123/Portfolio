import axiosInstance from '@/shared/api/axiosInstance';
import type { CurrentMetrics } from '../types/metrics.types';

export async function getCurrentMetrics(): Promise<CurrentMetrics> {
  try {
    const res = await axiosInstance.get<CurrentMetrics>('/metrics/current');

    console.log(res.data);

    return res.data;
  } catch (err) {
    console.error('');

    throw err;
  }
}
