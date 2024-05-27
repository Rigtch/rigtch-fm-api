import { ArgumentsHost } from '@nestjs/common'
import { MockProxy, mock } from 'vitest-mock-extended'
import { Request, Response } from 'express'
import { QueryFailedError } from 'typeorm'

import { QueryExceptionFilter } from './query-exception.filter'

import { hostFactoryMock } from '@common/mocks'

describe('QueryExceptionFilter', () => {
  let queryExceptionFilter: QueryExceptionFilter

  beforeEach(() => {
    queryExceptionFilter = new QueryExceptionFilter()
  })

  test('should be defined', () => {
    expect(queryExceptionFilter).toBeDefined()
  })

  describe('catch', () => {
    const url = 'http://localhost:3000'
    const message = 'message'

    let hostMock: MockProxy<ArgumentsHost>
    let requestMock: MockProxy<Request>
    let responseMock: MockProxy<Response>
    let exception: QueryFailedError

    beforeEach(() => {
      responseMock = mock<Response>({
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      })
      requestMock = mock<Request>({
        url,
      })
      hostMock = hostFactoryMock(requestMock, responseMock)
      exception = new QueryFailedError(message, [], new Error(message))
    })

    test('should call response.status with 500', () => {
      queryExceptionFilter.catch(exception, hostMock)

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(responseMock.status).toHaveBeenCalledWith(500)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 500,
        timestamp: expect.any(String),
        path: url,
        message,
        errors: [exception],
      })
    })
  })
})
