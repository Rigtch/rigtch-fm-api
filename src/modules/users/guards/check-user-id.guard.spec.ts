import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DeepMockProxy } from 'vitest-mock-extended'
import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { UsersRepository } from '../users.repository'

import { CheckUserIdGuard } from './check-user-id.guard'

import { contextFactoryMock, userMock } from '@common/mocks'

describe('CheckUserIdGuard', () => {
  const id = '2a348ca4-7a80-4f0f-b42a-c6c62a1145c6'

  let moduleRef: TestingModule
  let checkUserIdGuard: CheckUserIdGuard
  let usersRepository: UsersRepository

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
  })

  afterEach(() => {
    moduleRef.close()
  })

  it('should be defined', () => {
    expect(checkUserIdGuard).toBeDefined()
  })

  describe('canActivate', () => {
    let findOneBySpy: MockInstance

    let contextMock: DeepMockProxy<ExecutionContext>

    beforeEach(() => {
      findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')
      contextMock = contextFactoryMock({
        params: {
          id,
        },
      })
    })

    test('should throw BadRequestException if id is not a UUID', async () => {
      const id = 'not-a-uuid'

      contextMock = contextFactoryMock({
        params: {
          id,
        },
      })

      await expect(
        checkUserIdGuard.canActivate(contextMock)
      ).rejects.toThrowError(BadRequestException)
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
