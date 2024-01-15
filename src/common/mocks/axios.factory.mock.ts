import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const axiosResponseMockFactory = <TData = unknown>(
  data: TData,
  status = 200
): AxiosResponse<TData> =>
  ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  }) as AxiosResponse<TData>

export const axiosErrorMockFactory = <TData = unknown>(
  data: TData,
  status = 200
): AxiosError<TData> =>
  ({
    response: {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    },
  }) as AxiosError<TData>
