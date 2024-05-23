import { ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { mock } from 'vitest-mock-extended'

export function contextFactoryMock(request: Partial<Request>) {
  return mock<ExecutionContext>({
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue(request),
    }),
    getType: vi.fn().mockReturnValue('http'),
  })
}
