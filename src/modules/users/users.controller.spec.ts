import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

import { userMock } from '@common/mocks'

describe('UsersController', () => {
  let usersController: UsersController
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: UsersRepository,
          useValue: {
            findUsers: vi.fn(),
            findUserById: vi.fn(),
            findUserByProfileId: vi.fn(),
            findUserByDisplayName: vi.fn(),
          },
        },
      ],
    }).compile()

    usersController = module.get<UsersController>(UsersController)
    usersRepository = module.get<UsersRepository>(UsersRepository)
  })

  test('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getOneByProfileId', () => {
    test('should get one user by profile id', async () => {
      vi.spyOn(usersRepository, 'findUserByProfileId').mockResolvedValue(
        userMock
      )

      const profileId = '1'

      expect(await usersController.getOneByProfileId(profileId)).toEqual(
        userMock
      )

      expect(usersRepository.findUserByProfileId).toHaveBeenCalledWith(
        profileId
      )
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserByProfileId')

      const profileId = '1'

      await expect(
        usersController.getOneByProfileId(profileId)
      ).rejects.toThrowError()

      expect(usersRepository.findUserByProfileId).toHaveBeenCalledWith(
        profileId
      )
    })
  })
})
