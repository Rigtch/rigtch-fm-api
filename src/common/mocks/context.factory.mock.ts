import { ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { DeepPartial } from 'typeorm'
import { mock } from 'vitest-mock-extended'

export function contextFactoryMock(request: DeepPartial<Request>) {
  return mock<ExecutionContext>({
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({
        params: {
          id: undefined,
        },
        ...request,
      }),
    }),
    getType: vi.fn().mockReturnValue('http'),
  })
}
