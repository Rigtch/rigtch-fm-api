import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const axiosResponseMockFactory = <TData = unknown>(
  data: TData
): AxiosResponse<TData> => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as InternalAxiosRequestConfig,
})
