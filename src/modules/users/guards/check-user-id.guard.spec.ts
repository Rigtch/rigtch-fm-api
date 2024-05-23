import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DeepMockProxy, mockDeep } from 'vitest-mock-extended'
import { ExecutionContext, NotFoundException } from '@nestjs/common'

import { UsersRepository } from '../users.repository'

import { CheckUserIdGuard } from './check-user-id.guard'

import { userMock } from '@common/mocks'

describe('CheckUserIdGuard', () => {
  const id = 'id'

  let moduleRef: TestingModule
  let checkUserIdGuard: CheckUserIdGuard
  let usersRepository: UsersRepository

  let contextMock: DeepMockProxy<ExecutionContext>

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        CheckUserIdGuard,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
      ],
    }).compile()

    checkUserIdGuard = moduleRef.get(CheckUserIdGuard)
    usersRepository = moduleRef.get(UsersRepository)

    contextMock = mockDeep<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          params: {
            id,
          },
        }),
      }),
    } as ExecutionContext)
  })

  afterEach(() => {
    moduleRef.close()
  })

  it('should be defined', () => {
    expect(checkUserIdGuard).toBeDefined()
  })

  describe('canActivate', () => {
    let findOneBySpy: MockInstance

    beforeEach(() => {
      findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
    })

    test('should return true if user is found', async () => {
      findOneBySpy.mockResolvedValueOnce(userMock)

      expect(await checkUserIdGuard.canActivate(contextMock)).toBeTruthy()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw NotFoundException if user is not found', async () => {
      findOneBySpy.mockResolvedValueOnce(null)

      await expect(
        checkUserIdGuard.canActivate(contextMock)
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })
})
