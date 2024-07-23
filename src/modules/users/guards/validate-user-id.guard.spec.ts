import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DeepMockProxy } from 'vitest-mock-extended'
import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { UsersRepository } from '../users.repository'

import { ValidateUserIdGuard } from './validate-user-id.guard'

import { contextFactoryMock, userMock } from '@common/mocks'

describe('ValidateUserIdGuard', () => {
  const id = '2a348ca4-7a80-4f0f-b42a-c6c62a1145c6'

  let moduleRef: TestingModule
  let validateUserIdGuard: ValidateUserIdGuard
  let usersRepository: UsersRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ValidateUserIdGuard,
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
      ],
    }).compile()

    validateUserIdGuard = moduleRef.get(ValidateUserIdGuard)
    usersRepository = moduleRef.get(UsersRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  it('should be defined', () => {
    expect(validateUserIdGuard).toBeDefined()
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
        validateUserIdGuard.canActivate(contextMock)
      ).rejects.toThrowError(BadRequestException)
    })

    test('should return true if user is found', async () => {
      findOneBySpy.mockResolvedValueOnce(userMock)

      expect(await validateUserIdGuard.canActivate(contextMock)).toBeTruthy()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw NotFoundException if user is not found', async () => {
      findOneBySpy.mockResolvedValueOnce(null)

      await expect(
        validateUserIdGuard.canActivate(contextMock)
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })
})
