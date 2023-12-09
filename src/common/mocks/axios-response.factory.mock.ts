import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const axiosResponseMockFactory = <TData = unknown>(
  data: TData,
  status = 200
): AxiosResponse<TData> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} as InternalAxiosRequestConfig,
})
