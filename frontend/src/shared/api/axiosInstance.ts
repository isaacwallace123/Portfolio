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
  const raw = import.meta.env.VITE_BACKEND_URL?.trim();
  if (!raw) {
    throw new Error(
      '[CONFIG] VITE_BACKEND_URL is missing. Set it at build time (e.g. https://api.isaacwallace.dev).'
    );
  }

  const baseURL = raw.replace(/\/+$/, '');

  try {
    const u = new URL(baseURL);
    if (u.pathname && u.pathname !== '/' && u.pathname !== '') {
      throw new Error(
        `[CONFIG] VITE_BACKEND_URL must not include a path. Use origin only (e.g. https://api.isaacwallace.dev), not "${baseURL}".`
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    throw new Error(
      `[CONFIG] VITE_BACKEND_URL is not a valid absolute URL: "${raw}"`
    );
  }

  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const useV2 = config.useV2 ?? false;

      const versionPath = useV2 ? '/api/v2' : '/api/v1';

      if (
        config.url &&
        !config.url.startsWith('http://') &&
        !config.url.startsWith('https://')
      ) {
        const rel = config.url.startsWith('/') ? config.url : `/${config.url}`;

        config.url = versionPath + rel;
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
