import axiosErrorResponseHandler from '@/shared/api/axiosErrorResponseHandler.ts';
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

axios.defaults.withCredentials = false;

declare module 'axios' {
  export interface AxiosRequestConfig {
    useV2?: boolean;
  }
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  useV2?: boolean;
}

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const useV2 = config.useV2 !== undefined ? config.useV2 : false;
      const versionPath = useV2 ? '/api/v2' : '/api/v1';

      if (
        config.url &&
        !config.url.startsWith('http://') &&
        !config.url.startsWith('https://')
      ) {
        config.url = versionPath + config.url;
      }
      delete config.useV2;
      return config;
    },
    error => Promise.reject(error)
  );

  instance.interceptors.response.use(
    response => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status ?? 0;

        const mapped = axiosErrorResponseHandler(
          error as AxiosError,
          statusCode
        );

        return Promise.reject(mapped);
      }

      return Promise.reject(new Error('Unexpected error object'));
    }
  );

  return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
