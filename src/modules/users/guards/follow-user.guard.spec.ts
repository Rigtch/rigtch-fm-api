import { ExecutionContext } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DeepMockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '../users.repository'

import { FollowUserGuard } from './follow-user.guard'

import { contextFactoryMock, userMock } from '@common/mocks'

describe('FollowUserGuard', () => {
  let moduleRef: TestingModule
  let followUserGuard: FollowUserGuard
  let usersRepository: UsersRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        FollowUserGuard,
        {
          provide: UsersRepository,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile()

    followUserGuard = moduleRef.get(FollowUserGuard)
    usersRepository = moduleRef.get(UsersRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(followUserGuard).toBeDefined()
  })

  describe('canActivate', () => {
    let findOneSpy: MockInstance
    const followerId = '2a348ca4-7a80-4f0f-b42a-c6c62a1145c6'
    const relations = {
      following: true,
    }
    const select = relations

    let contextMock: DeepMockProxy<ExecutionContext>

    beforeEach(() => {
      findOneSpy = vi.spyOn(usersRepository, 'findOne')
      contextMock = contextFactoryMock({
        user: userMock,
        body: {
          followerId,
        },
      })
    })

    test('should throw error if userId and followerId are the same', async () => {
      contextMock = contextFactoryMock({
        user: {
          ...userMock,
          id: followerId,
        },
        body: {
          followerId,
        },
      })

      findOneSpy.mockResolvedValue(userMock)

      await expect(
        followUserGuard.canActivate(contextMock)
      ).rejects.toThrowError('You cannot follow yourself.')
      expect(findOneSpy).not.toHaveBeenCalled()
    })

    test('should return false if follower is not found', async () => {
      findOneSpy.mockResolvedValue(null)

      expect(await followUserGuard.canActivate(contextMock)).toBeFalsy()
      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          id: followerId,
        },
        relations,
        select,
      })
    })

    test('should throw error if user is already following the follower', async () => {
      findOneSpy.mockResolvedValue({
        following: [userMock],
      })

      await expect(
        followUserGuard.canActivate(contextMock)
      ).rejects.toThrowError('You are already following this user.')
      expect(findOneSpy).toHaveBeenCalledWith({
        where: {
          id: followerId,
        },
        relations,
        select,
      })
    })
  })
})
