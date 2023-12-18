import { applyAuthorizationHeader } from './apply-authorization-header.util'

describe('applyAuthorizationHeader', () => {
  test('should return valid object', () => {
    const {
      headers: { Authorization },
    } = applyAuthorizationHeader('token')

    expect(Authorization).toBe('Bearer token')
  })
})
