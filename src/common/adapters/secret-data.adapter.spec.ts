import { test, describe, expect } from 'vitest'

import { SpotifyToken } from '../types/spotify'

import { adaptSecretData } from './secret-data.adapter'

import { SecretData } from '~/modules/auth'

describe('adaptSecretData', () => {
  test('should adapt secret data', () => {
    const spotifyTokenMock: SpotifyToken = {
      access_token: 'accessToken',
      token_type: 'tokenType',
      scope: 'scope',
      expires_in: 3600,
      refresh_token: 'refreshToken',
    }

    const secretDataMock: SecretData = {
      accessToken: 'accessToken',
      expiresIn: 3600,
      refreshToken: 'refreshToken',
    }

    expect(adaptSecretData(spotifyTokenMock)).toEqual(secretDataMock)
  })
})
