import { ArgumentsHost } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'
import type { Request, Response } from 'express'

export function hostFactoryMock(
  request: Partial<Request>,
  response: Partial<Response>
) {
  return mock<ArgumentsHost>({
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue(request),
      getResponse: vi.fn().mockReturnValue(response),
    }),
    getType: vi.fn().mockReturnValue('http'),
  })
}
