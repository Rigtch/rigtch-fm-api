import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

import { userMock, usersMock } from '@common/mocks'

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

  describe('getAll', () => {
    test('should get all users', async () => {
      vi.spyOn(usersRepository, 'findUsers').mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(usersRepository.findUsers).toHaveBeenCalled()
    })

    test('should get one user by username', async () => {
      vi.spyOn(usersRepository, 'findUserByDisplayName').mockResolvedValue(
        userMock
      )

      const username = 'username'

      expect(await usersController.getAll(username)).toEqual(userMock)

      expect(usersRepository.findUserByDisplayName).toHaveBeenCalledWith(
        username
      )
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserByDisplayName')

      const username = 'username'

      await expect(usersController.getAll(username)).rejects.toThrowError()
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', async () => {
      vi.spyOn(usersRepository, 'findUserById').mockResolvedValue(userMock)

      const id = '1'

      expect(await usersController.getOneById(id)).toEqual(userMock)

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
    })

    test('should throw an error if no user is found', async () => {
      vi.spyOn(usersRepository, 'findUserById')

      const id = '1'

      await expect(usersController.getOneById(id)).rejects.toThrowError()

      expect(usersRepository.findUserById).toHaveBeenCalledWith(id)
    })
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
