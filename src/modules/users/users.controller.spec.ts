import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersRepository } from './users.repository'

import { userMock, usersMock } from '@common/mocks'

describe('UsersController', () => {
  const id = '1'
  const displayName = 'displayName'

  let usersController: UsersController
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: UsersRepository,
          useValue: {
            find: vi.fn(),
            findOneBy: vi.fn(),
            findOneByDisplayName: vi.fn(),
          },
        },
      ],
    }).compile()

    usersController = module.get(UsersController)
    usersRepository = module.get(UsersRepository)
  })

  test('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getAll', () => {
    test('should get all users', async () => {
      const findSpy = vi
        .spyOn(usersRepository, 'find')
        .mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(findSpy).toHaveBeenCalled()
    })

    test('should get one user by username', async () => {
      const findOneByDisplayNameSpy = vi
        .spyOn(usersRepository, 'findOneByDisplayName')
        .mockResolvedValue(userMock)

      expect(await usersController.getAll(displayName)).toEqual(userMock)

      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(displayName)
    })

    test('should throw an error if no user is found', () => {
      const findOneByDisplayNameSpy = vi.spyOn(
        usersRepository,
        'findOneByDisplayName'
      )

      expect(usersController.getAll(displayName)).rejects.toThrowError()
      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(displayName)
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)

      expect(await usersController.getOneById(id)).toEqual(userMock)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw an error if no user is found', () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      expect(usersController.getOneById(id)).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })
})
