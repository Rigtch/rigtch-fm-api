import { Request } from 'express'
import { createRequest } from 'node-mocks-http'

import { getAccessToken } from '.'

describe('getAccessToken', () => {
  let request: Request

  beforeEach(() => {
    request = createRequest()
  })

  it('should return the access token', () => {
    const accessToken = '123'
    request.headers = {
      authorization: `Bearer ${accessToken}`,
    }
    const result = getAccessToken(request)

    expect(result).toEqual(accessToken)
  })
})
