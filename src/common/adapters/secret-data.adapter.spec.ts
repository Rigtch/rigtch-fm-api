import { Test } from '@nestjs/testing'

import { SecretDataAdapter } from './secret-data.adapter'

import { accessTokenMock } from '@common/mocks'

describe('SecretDataAdapter', () => {
  let secretDataAdapter: SecretDataAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SecretDataAdapter],
    }).compile()

    secretDataAdapter = module.get(SecretDataAdapter)
  })

  test('should be defined', () => {
    expect(secretDataAdapter).toBeDefined()
  })

  test('should adapt an access token', () => {
    expect(secretDataAdapter.adapt(accessTokenMock)).toEqual({
      accessToken: accessTokenMock.access_token,
      expiresIn: accessTokenMock.expires_in,
      refreshToken: accessTokenMock.refresh_token,
    })
  })
})
