import { AccessToken } from '@spotify/web-api-ts-sdk'
import { mockDeep } from 'vitest-mock-extended'

export const accessToken = 'accessToken'
export const refreshToken = 'refreshToken'

export const accessTokenMock = mockDeep<AccessToken>({
  access_token: accessToken,
  refresh_token: refreshToken,
})
