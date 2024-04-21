import { Test, TestingModule } from '@nestjs/testing'

import { SecretDataAdapter } from './secret-data.adapter'

import { accessTokenMock } from '@common/mocks'

describe('SecretDataAdapter', () => {
  let moduleRef: TestingModule
  let secretDataAdapter: SecretDataAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [SecretDataAdapter],
    }).compile()

    secretDataAdapter = moduleRef.get(SecretDataAdapter)
  })

  afterEach(() => {
    moduleRef.close()
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
