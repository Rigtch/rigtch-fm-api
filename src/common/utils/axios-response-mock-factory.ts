import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const axiosResponseMockFactory = <T = unknown>(
  data: T
): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as InternalAxiosRequestConfig,
})
