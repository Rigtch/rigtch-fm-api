import { getRequestUser } from './request-user.decorator'

import { contextFactoryMock, userMock } from '@common/mocks'

describe('getRequestUser', () => {
  test('should return the user from request', () => {
    expect(
      getRequestUser(
        {},
        contextFactoryMock({
          user: userMock,
        })
      )
    ).toEqual(userMock)
  })
})
