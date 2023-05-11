import { applyAuthorizationHeader } from './apply-authorization-header'

describe('applyAuthorizationHeader', () => {
  test('should return valid object', () => {
    const {
      headers: { Authorization },
    } = applyAuthorizationHeader('token')

    expect(Authorization).toEqual('Bearer token')
  })
})
