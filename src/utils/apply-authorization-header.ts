import { AxiosRequestConfig } from 'axios'

export const applyAuthorizationHeader = (
  accessToken: string
): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})
