import axiosErrorResponseHandler from '@/shared/api/axiosErrorResponseHandler.ts';

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

axios.defaults.withCredentials = true;

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
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const useV2 = config.useV2 !== undefined ? config.useV2 : true;
      const versionPath = useV2 ? '/v2/gateway' : '/gateway';

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
    error => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    response => response,
    error => {
      handleAxiosError(error);
      return Promise.reject(error);
    }
  );

  return instance;
};

const handleAxiosError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? 0;

    axiosErrorResponseHandler(error, statusCode);
  } else {
    console.error('An unexpected error occurred:', error);
  }
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
